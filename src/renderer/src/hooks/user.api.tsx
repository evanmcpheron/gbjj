import { useDB } from '@renderer/context/db.context'
import { GreenevilleBJJUser, Promotion } from '@renderer/types/users.types'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

export const useUserApi = () => {
  const { user: apiUser, promotion: apiPromotion } = useDB()
  const [isLoading, setIsLoading] = useState(false)
  const [allUsers, setAllUsers] = useState<GreenevilleBJJUser[]>([])
  const [userLookup, setUserLookup] = useState<GreenevilleBJJUser | null>(null)

  const fetchAllUsers = useCallback(
    async (options?: { skip?: number; limit?: number; filter?: Partial<GreenevilleBJJUser> }) => {
      setIsLoading(true)
      try {
        if (!apiUser) {
          setAllUsers([])
          return
        }

        let query = apiUser.find()
        if (options?.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.where(key as any).eq(value as any)
          })
        }
        if (options?.skip !== undefined) query = query.skip(options.skip)
        if (options?.limit !== undefined) query = query.limit(options.limit)
        const docs = await query.exec()
        const usersWithRank = await Promise.all(
          docs.map(async (doc) => {
            const user = doc.toMutableJSON()
            const promo = await getMostRecentPromotionByUserId(user.id)
            // if they’ve never been promoted, fall back to their current belt/stripes:
            user.rank = promo ?? { belt: user.belt, stripes: user.stripes }
            return user
          })
        )
        setAllUsers(usersWithRank)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const fetchUserById = async (id: string) => {
    setIsLoading(true)
    try {
      if (!apiUser) {
        setUserLookup(null)

        return
      }

      const doc = await apiUser.findOne(id).exec()
      const user = doc.toMutableJSON()

      getMostRecentPromotionByUserId(doc.toJSON().id).then((promotion) => {
        user.rank = promotion
      })

      const data = doc ? user : null

      setUserLookup(data)
      return data
    } catch (err) {
      console.error(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllPromotionsByUserId = async (userId: string): Promise<Promotion[]> => {
    setIsLoading(true)
    try {
      if (!apiPromotion) {
        return []
      }

      const docs = await apiPromotion
        .find()
        .where('userId')
        .eq(userId)
        .sort({ promotedAt: 'desc' })
        .exec()
      const data = docs ? docs : []

      return data
    } catch (err) {
      console.error(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const deletePromotion = async (promotionId: string) => {
    setIsLoading(true)
    try {
      if (!apiPromotion) return

      const doc = await apiPromotion.findOne(promotionId).exec()
      if (!doc) throw new Error('Promotion not found')
      await doc.remove()
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = useCallback(
    async (user: Partial<GreenevilleBJJUser>) => {
      setIsLoading(true)
      try {
        if (!apiUser) {
          return
        }
        user.id = uuid()
        const doc = await apiUser.insert(user as GreenevilleBJJUser)
        return doc.toJSON()
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const promoteUser = async (promotion: Partial<Promotion>) => {
    setIsLoading(true)
    try {
      if (!apiPromotion) {
        return
      }
      promotion.id = uuid()
      promotion.promotedAt = new Date().toISOString()

      const doc = await apiPromotion.insert(promotion as Promotion)
      return doc.toJSON()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMostRecentPromotionByUserId = async (userId: string) => {
    try {
      if (!apiPromotion) {
        console.log(`🚀 ~ user.api.tsx:153 ~ getMostRecentPromotionByUserId ~ docs: \n`)

        return null
      }

      const docs = await apiPromotion
        .find()
        .where('userId')
        .eq(userId)
        .sort({ createdAt: 'desc' })
        .limit(1)
        .exec()

      if (docs.length === 0) {
        return null
      }

      return docs[0].toJSON()
    } catch (err) {
      console.error(err)
      return null
    } finally {
    }
  }

  const updateUser = useCallback(
    async (id: string, updates: Partial<GreenevilleBJJUser>) => {
      setIsLoading(true)
      try {
        if (!apiUser) {
          return
        }

        const doc = await apiUser.findOne(id).exec()
        if (!doc) throw new Error('User not found')
        const updatedData = { ...doc.toJSON(), ...updates }
        await apiUser.upsert(updatedData as any)

        return doc.toJSON()
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const deleteUser = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        if (!apiUser) {
          return
        }

        const doc = await apiUser.findOne(id).exec()
        if (!doc) throw new Error('User not found')
        await doc.remove()
        return true
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  useEffect(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

  return {
    isLoading,
    allUsers,
    userLookup,
    fetchAllUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    promoteUser,
    getMostRecentPromotionByUserId,
    fetchAllPromotionsByUserId,
    deletePromotion
  }
}
