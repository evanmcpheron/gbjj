import { useState, useCallback } from 'react'
import { useDB } from '@renderer/context/db.context'
import { GreenevilleBJJUser, Promotion, BeltColor } from '@renderer/types/users.types'
import { v4 as uuid } from 'uuid'
import { GreenevilleBJJObject } from '@renderer/types/base.types'
import { useCheckinApi } from './checkin.api'

/**
 * Hook for Promotions
 */
export const usePromotionApi = () => {
  const { promotion: api } = useDB()
  const [loading, setLoading] = useState(false)

  // Wrapper to manage loading state
  const withLoading =
    <T extends any[]>(fn: (...args: T) => Promise<any>) =>
    async (...args: T) => {
      setLoading(true)
      try {
        return await fn(...args)
      } finally {
        setLoading(false)
      }
    }

  /** Fetch promotions, optionally filtered by userId */
  const fetchPromotions = useCallback(
    async (opts: { userId?: string; skip?: number; limit?: number } = {}) => {
      if (!api) return []
      let q = api.find()
      if (opts.userId) q = q.where('userId').eq(opts.userId)
      if (opts.skip !== undefined) q = q.skip(opts.skip)
      if (opts.limit !== undefined) q = q.limit(opts.limit)
      const docs = await q.sort({ promotedAt: 'desc' }).exec()
      return docs.map((d) => d.toJSON())
    },
    [api]
  )

  /** Get the most recent promotion for a user */
  const getMostRecentPromotionByUserId = useCallback(
    async (userId: string): Promise<Promotion | null> => {
      const results = await fetchPromotions({ userId, limit: 1 })
      return results[0] ?? null
    },
    [fetchPromotions]
  )

  /** Create a new promotion */
  const createPromotion = useCallback(
    async (
      data: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'promotedAt'> & {
        promotedAt?: string
      }
    ): Promise<Promotion | null> => {
      if (!api) return null
      const now = new Date().toISOString()
      const promo: Promotion = {
        id: uuid(),
        userId: data.userId,
        belt: data.belt,
        stripes: data.stripes,
        promotedAt: data.promotedAt ?? now,
        createdAt: now,
        updatedAt: now
      }
      await api.insert(promo)
      return promo
    },
    [api]
  )

  /** Delete a promotion by ID */
  const deletePromotion = useCallback(
    async (id: string): Promise<boolean> => {
      if (!api) return false
      const doc = await api.findOne(id).exec()
      await doc.remove()
      return true
    },
    [api]
  )

  return {
    loading,
    fetchPromotions: withLoading(fetchPromotions),
    createPromotion: withLoading(createPromotion),
    deletePromotion: withLoading(deletePromotion),
    getMostRecentPromotionByUserId: withLoading(getMostRecentPromotionByUserId)
  }
}

/**
 * Hook for Users, leveraging Promotion hook
 */
export const useUserApi = () => {
  const { user: api } = useDB()
  const promotionApi = usePromotionApi()
  const checkinApi = useCheckinApi()
  const [loading, setLoading] = useState(false)
  const [allUsers, setAllUsers] = useState<GreenevilleBJJUser[]>([])
  const [userLookup, setUserLookup] = useState<GreenevilleBJJUser | null>(null)

  const withLoading =
    <T extends any[]>(fn: (...args: T) => Promise<any>) =>
    async (...args: T) => {
      setLoading(true)
      try {
        return await fn(...args)
      } finally {
        setLoading(false)
      }
    }

  /**
   * Generic user fetch with optional filter, skip, limit
   */
  const fetchUsers = useCallback(
    async (
      opts: {
        filter?: Partial<GreenevilleBJJUser>
        skip?: number
        limit?: number
      } = {}
    ): Promise<GreenevilleBJJUser[]> => {
      if (!api) return []
      let q = api.find()
      if (opts.filter)
        Object.entries(opts.filter).forEach(([k, v]) => {
          q = q.where(k as any).eq(v as any)
        })
      if (opts.skip !== undefined) q = q.skip(opts.skip)
      if (opts.limit !== undefined) q = q.limit(opts.limit)
      const docs = await q.exec()

      const users = await Promise.all(
        docs.map(async (doc) => {
          const base = doc.toMutableJSON()
          const promotions = await promotionApi.fetchPromotions({ userId: base.id })
          const rank = (await promotionApi.getMostRecentPromotionByUserId(base.id)) ?? {
            id: uuid(),
            userId: base.id,
            belt: BeltColor.WHITE,
            stripes: 0,
            promotedAt: '',
            createdAt: '',
            updatedAt: ''
          }

          const { allCheckins, thisMonthCheckins, lastMonthCheckins } =
            await checkinApi.fetchBasicCheckinData(base.id)
          const user: GreenevilleBJJUser = {
            ...base,
            promotions,
            checkins: allCheckins || [],
            rank,
            checkinsAtRank: allCheckins.filter(
              (checkin) => checkin.belt === rank.belt && checkin.stripes === rank.stripes
            ),
            checkinsLastMonth: lastMonthCheckins,
            checkinsThisMonth: thisMonthCheckins
          }
          return user
        })
      )
      return users
    },
    [api, promotionApi]
  )

  /** Fetch a single user by ID */
  const fetchUserById = useCallback(
    async (id: string): Promise<GreenevilleBJJUser | null> => {
      if (!api) return null
      const doc = await api.findOne(id).exec()
      if (!doc) return null
      const base = doc.toMutableJSON()
      const promotions = await promotionApi.fetchPromotions({ userId: id })
      const rank = (await promotionApi.getMostRecentPromotionByUserId(id)) ?? {
        id: uuid(),
        userId: id,
        belt: BeltColor.WHITE,
        stripes: 0,
        promotedAt: '',
        createdAt: '',
        updatedAt: ''
      }

      const { allCheckins, thisMonthCheckins, lastMonthCheckins } =
        await checkinApi.fetchBasicCheckinData(id)

      const user: GreenevilleBJJUser = {
        ...base,
        promotions,
        checkins: allCheckins,
        rank,
        checkinsAtRank: allCheckins.filter(
          (checkin) => checkin.belt === rank.belt && checkin.stripes === rank.stripes
        ),
        checkinsLastMonth: lastMonthCheckins,
        checkinsThisMonth: thisMonthCheckins
      }
      return user
    },
    [api, promotionApi]
  )

  const fetchUserByPhone = useCallback(
    async (phoneNumber: string): Promise<GreenevilleBJJUser | null> => {
      if (!api) return null
      const doc = await api.find().where('phone').eq(phoneNumber).exec()
      if (!doc) return null
      const base = doc?.[0]?.toMutableJSON()
      if (!base) return null
      const { id } = base
      const promotions = await promotionApi.fetchPromotions({ userId: id })
      const rank = (await promotionApi.getMostRecentPromotionByUserId(id)) ?? {
        id: uuid(),
        userId: id,
        belt: BeltColor.WHITE,
        stripes: 0,
        promotedAt: '',
        createdAt: '',
        updatedAt: ''
      }

      const { allCheckins, thisMonthCheckins, lastMonthCheckins } =
        await checkinApi.fetchBasicCheckinData(id)

      const user: GreenevilleBJJUser = {
        ...base,
        promotions,
        checkins: allCheckins,
        rank,
        checkinsAtRank: allCheckins.filter(
          (checkin) => checkin.belt === rank.belt && checkin.stripes === rank.stripes
        ),
        checkinsLastMonth: lastMonthCheckins,
        checkinsThisMonth: thisMonthCheckins
      }
      return user
    },
    [api, promotionApi]
  )

  /** Create a new user */
  const createUser = useCallback(
    async (
      data: Omit<
        GreenevilleBJJUser,
        | 'id'
        | 'promotions'
        | 'checkins'
        | 'rank'
        | 'checkinsAtRank'
        | 'checkinsLastMonth'
        | 'checkinsThisMonth'
        | 'createdAt'
        | 'updatedAt'
      >
    ): Promise<GreenevilleBJJUser | null> => {
      if (!api) return null
      const now = new Date().toISOString()
      const newUser = {
        id: uuid(),
        ...data,
        createdAt: now,
        updatedAt: now
      }
      await api.insert(newUser as any)
      return await fetchUserById(newUser.id)
    },
    [api, fetchUserById]
  )

  /** Update a user by ID */
  const updateUser = useCallback(
    async (id: string, updates: GreenevilleBJJObject): Promise<GreenevilleBJJUser | null> => {
      if (!api) return null
      const doc = await api.findOne(id).exec()

      if (!doc) throw new Error('User not found')
      const now = new Date().toISOString()
      const mutableDoc = doc.toMutableJSON()

      delete updates.checkins
      delete updates.checkinsAtRank
      delete updates.checkinsThisMonth
      delete updates.checkinsLastMonth
      delete updates.checkinsThisMonth
      delete updates.promotions

      const updatedData = { ...mutableDoc, ...updates, updatedAt: now }
      await api.upsert(updatedData as any)

      return await fetchUserById(id)
    },
    [api, fetchUserById]
  )

  /** Delete a user by ID */
  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      if (!api) return false
      const doc = await api.findOne(id).exec()
      await doc.remove()
      return true
    },
    [api]
  )

  return {
    isLoading: loading,
    allUsers,
    userLookup,
    fetchAllUsers: withLoading(async () => setAllUsers(await fetchUsers())),
    fetchUserById: withLoading(async (id: string) => {
      const u = await fetchUserById(id)
      setUserLookup(u)
      return u
    }),
    fetchUserByPhone: withLoading(fetchUserByPhone),
    createUser: withLoading(createUser),
    updateUser: withLoading(updateUser),
    deleteUser: withLoading(deleteUser)
  }
}
