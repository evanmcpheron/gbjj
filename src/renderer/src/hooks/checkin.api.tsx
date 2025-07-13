import { useState, useEffect, useCallback } from 'react'
import type { BeltColor, Checkin } from '@renderer/types/users.types'
import { useDB } from '@renderer/context/db.context'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'

export const useCheckinApi = () => {
  const { checkin: api } = useDB()
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

  const fetchCheckins = useCallback(
    async (
      opts: {
        userId?: string
        from?: string
        to?: string
        belt?: BeltColor
        stripes?: number
        skip?: number
        limit?: number
      } = {}
    ) => {
      if (!api) return []
      let q = api.find()
      if (opts.userId) q = q.where('userId').eq(opts.userId)
      if (opts.belt) q = q.where('belt').eq(opts.belt)
      if (opts.stripes !== undefined) q = q.where('stripes').eq(opts.stripes)
      if (opts.from) q = q.where('checkedAt').gte(opts.from)
      if (opts.to) q = q.where('checkedAt').lte(opts.to)
      if (opts.skip !== undefined) q = q.skip(opts.skip)
      if (opts.limit !== undefined) q = q.limit(opts.limit)

      const docs = await q.sort({ checkedAt: 'desc' }).exec()
      return docs.map((d) => d.toJSON())
    },
    [api]
  )

  /**
   * Fetch the most recent check-in for a user
   */
  const fetchLastCheckin = useCallback(
    async (userId: string) => {
      if (!api) return null
      const docs = await api
        .find()
        .where('userId')
        .eq(userId)
        .sort({ checkedAt: 'desc' })
        .limit(1)
        .exec()
      return docs[0]?.toJSON() ?? null
    },
    [api]
  )

  const fetchBasicCheckinData = useCallback(
    async (userId: string) => {
      const startThisMonth = dayjs().startOf('month').toISOString()
      const startLastMonth = dayjs().startOf('month').subtract(1, 'month').toISOString()
      const endThisMonth = dayjs().endOf('month').toISOString()
      const endLastMonth = dayjs().endOf('month').subtract(1, 'month').toISOString()
      const allCheckins = await fetchCheckins({ userId })
      const thisMonthCheckins = await fetchCheckins({
        userId,
        from: startThisMonth,
        to: endThisMonth
      })

      const lastMonthCheckins = await fetchCheckins({
        userId,
        from: startLastMonth,
        to: endLastMonth
      })

      return { allCheckins, thisMonthCheckins, lastMonthCheckins }
    },
    [api]
  )

  const upsertCheckin = useCallback(
    async (
      userId: string,
      data: { belt: BeltColor; stripes: number; checkedAt?: string },
      opts: { enforceWindow?: boolean } = { enforceWindow: true }
    ) => {
      if (!api) return
      if (opts.enforceWindow) {
        const last = await fetchLastCheckin(userId)
        const elapsed = Date.now() - Date.parse(last?.checkedAt ?? '0')
        const windowMs = 12 * 60 * 60 * 1000
        if (elapsed < windowMs) return
      }
      const now = new Date().toISOString()
      const doc: Checkin = {
        id: uuid(),
        userId,
        belt: data.belt,
        stripes: data.stripes,
        checkedAt: data.checkedAt ?? now,
        createdAt: now,
        updatedAt: now
      }
      await api.insert(doc)
      return doc
    },
    [api, fetchLastCheckin]
  )

  const updateCheckin = useCallback(
    async (id: string, updates: Partial<Checkin>) => {
      if (!api) return
      const doc = await api.findOne(id).exec()
      if (!doc) throw new Error('Checkin not found')
      await doc.atomicUpdate((old) => ({ ...old, ...updates }))
      return doc.toJSON()
    },
    [api]
  )

  const deleteCheckin = useCallback(
    async (id: string) => {
      if (!api) return false

      const doc = await api.findOne(id).exec()
      await doc.remove()
      return true
    },
    [api]
  )

  useEffect(() => {
    withLoading(fetchCheckins)()
  }, [fetchCheckins])

  return {
    loading,
    fetchCheckins: withLoading(fetchCheckins),
    fetchBasicCheckinData: withLoading((userId: string) => {
      return fetchBasicCheckinData(userId)
    }),
    fetchCheckinsByUser: withLoading((userId: string, fromDate?: string, toDate?: string) => {
      return fetchCheckins({ userId, from: fromDate, to: toDate })
    }),
    fetchThisMonth: withLoading((userId: string) => {
      const start = dayjs().startOf('month').toISOString()
      const end = dayjs().endOf('month').toISOString()
      return fetchCheckins({ userId, from: start, to: end })
    }),
    fetchCheckinsByRank: withLoading((userId: string, belt: BeltColor, stripes: number) => {
      return fetchCheckins({ userId, belt, stripes })
    }),
    fetchLastMonth: withLoading((userId: string) => {
      const start = dayjs().subtract(1, 'month').startOf('month').toISOString()
      const end = dayjs().subtract(1, 'month').endOf('month').toISOString()
      return fetchCheckins({ userId, from: start, to: end })
    }),
    fetchLastCheckin: withLoading(fetchLastCheckin),

    createCheckin: withLoading((userId: string, belt: BeltColor, stripes: number) =>
      upsertCheckin(userId, { belt, stripes }, { enforceWindow: true })
    ),
    manualCreateCheckin: withLoading(
      (userId: string, belt: BeltColor, stripes: number, checkedAt: string) =>
        upsertCheckin(userId, { belt, stripes, checkedAt }, { enforceWindow: false })
    ),
    updateCheckin: withLoading(updateCheckin),
    deleteCheckin: withLoading(deleteCheckin),
    timeUntilNextCheckin: withLoading(async (userId: string) => {
      const last = await fetchLastCheckin(userId)
      const elapsed = Date.now() - Date.parse(last?.checkedAt ?? '0')
      const windowMs = 12 * 60 * 60 * 1000
      return elapsed >= windowMs ? 0 : windowMs - elapsed
    }),
    getNextCheckinTime: withLoading(async (userId: string) => {
      const last = await fetchLastCheckin(userId)
      const nextTs = Math.max(Date.now(), Date.parse(last?.checkedAt ?? '0') + 12 * 60 * 60 * 1000)
      return dayjs(nextTs).format('M/D/YYYY h:mm A')
    })
  }
}
