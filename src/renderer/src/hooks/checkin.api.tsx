// checkin.api.ts
import { useState, useEffect, useCallback } from 'react'
import type { BeltColor, Checkins } from '@renderer/types/users.types'
import { useDB } from '@renderer/context/db.context'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'

export const useCheckinApi = () => {
  const { checkin: apiCheckin, user: apiUser } = useDB()
  const [isLoading, setIsLoading] = useState(false)
  const [allCheckins, setAllCheckins] = useState<Checkins[]>([])
  const [checkinLookup, setCheckinLookup] = useState<Checkins | null>(null)

  const getMonthRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
    return { start, end }
  }

  const fetchAllCheckins = useCallback(
    async (options?: { skip?: number; limit?: number; filter?: Partial<Checkins> }) => {
      setIsLoading(true)
      try {
        if (!apiCheckin) {
          setAllCheckins([])
          return
        }

        let query = apiCheckin.find()
        if (options?.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.where(key as any).eq(value as any)
          })
        }
        if (options?.skip !== undefined) query = query.skip(options.skip)
        if (options?.limit !== undefined) query = query.limit(options.limit)
        const docs = await query.exec()
        setAllCheckins(docs.map((doc) => doc.toJSON()))
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    },
    [apiCheckin]
  )

  const fetchCheckinById = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        if (!apiCheckin) {
          setCheckinLookup(null)
          return
        }

        const doc = await apiCheckin.findOne(id).exec()
        const data = doc ? doc.toJSON() : null
        setCheckinLookup(data)
        return data
      } catch (err) {
        console.error(err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [apiCheckin]
  )

  const createCheckin = useCallback(
    async (userId: string, checkinData: Omit<Checkins, 'id' | 'checkedAt'>) => {
      setIsLoading(true)
      try {
        if (!apiUser) return
        const userDoc = await apiUser.findOne(userId).exec()
        if (!userDoc) throw new Error('User not found')

        const newCheckin: Checkins = {
          id: uuid(),
          checkedAt: new Date().toISOString(),
          belt: checkinData.belt,
          stripes: checkinData.stripes
        }

        // Merge in the new checkin and overwrite the whole doc:
        const updated = {
          ...userDoc.toJSON(),
          checkins: [...userDoc.checkins, newCheckin]
        }
        await apiUser.upsert(updated)

        return newCheckin
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )
  const manualCreateCheckin = useCallback(
    async (userId: string, checkinData: Omit<Checkins, 'id'>) => {
      setIsLoading(true)
      try {
        if (!apiUser) return
        const userDoc = await apiUser.findOne(userId).exec()
        if (!userDoc) throw new Error('User not found')

        const newCheckin: Checkins = {
          id: uuid(),
          checkedAt: checkinData.checkedAt,
          belt: checkinData.belt,
          stripes: checkinData.stripes
        }

        // Merge in the new checkin and overwrite the whole doc:
        const updated = {
          ...userDoc.toJSON(),
          checkins: [...userDoc.checkins, newCheckin]
        }
        await apiUser.upsert(updated)

        return newCheckin
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const updateCheckin = useCallback(
    async (id: string, updates: Partial<Checkins>) => {
      setIsLoading(true)
      try {
        if (!apiCheckin) {
          return
        }
        const doc = await apiCheckin.findOne(id).exec()
        if (!doc) throw new Error('Checkin not found')
        await doc.atomicUpdate((old) => ({ ...old, ...updates }))
        return doc.toJSON()
      } finally {
        setIsLoading(false)
      }
    },
    [apiCheckin]
  )

  const deleteCheckin = useCallback(
    async (userId: string, checkinId: string) => {
      setIsLoading(true)
      try {
        if (!apiUser) return false

        const userDoc = await apiUser.findOne(userId).exec()
        if (!userDoc) throw new Error('User not found')

        await userDoc.update({
          $set: {
            checkins: userDoc.checkins.filter((c) => c.id !== checkinId)
          }
        })

        return true
      } catch (error) {
        console.error('Failed to delete checkin:', error)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const fetchCheckinsThisMonth = useCallback(
    async (userId: string): Promise<Checkins[]> => {
      setIsLoading(true)
      try {
        if (!apiUser) return []
        const userDoc = await apiUser.findOne(userId).exec()
        if (!userDoc) return []
        const { start, end } = getMonthRange(new Date())
        return userDoc.checkins.filter((c) => {
          const t = Date.parse(c.checkedAt)
          return t >= start.getTime() && t <= end.getTime()
        })
      } catch (err) {
        console.error(err)
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const fetchCheckinsByUserId = useCallback(
    async (userId: string, fromIso?: string, toIso?: string): Promise<Checkins[]> => {
      setIsLoading(true)
      try {
        if (!apiUser) return []
        const userDoc = await apiUser.findOne(userId).exec()
        if (!userDoc) return []

        // parse cutoff timestamps if provided
        const fromTs = fromIso ? Date.parse(fromIso) : Number.NEGATIVE_INFINITY
        const toTs = toIso ? Date.parse(toIso) : Number.POSITIVE_INFINITY

        return userDoc.checkins.filter((c) => {
          const t = Date.parse(c.checkedAt)
          return t >= fromTs && t <= toTs
        })
      } catch (err) {
        console.error(err)
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const fetchCheckinsLastMonth = useCallback(
    async (userId: string): Promise<Checkins[]> => {
      setIsLoading(true)
      try {
        if (!apiUser) return []
        const userDoc = await apiUser.findOne(userId).exec()
        if (!userDoc) return []
        const now = new Date()
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const { start, end } = getMonthRange(lastMonth)
        return userDoc.checkins.filter((c) => {
          const t = Date.parse(c.checkedAt)
          return t >= start.getTime() && t <= end.getTime()
        })
      } catch (err) {
        console.error(err)
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const fetchCheckinsAtCurrentRank = useCallback(
    async (userId: string, belt: BeltColor, stripes: number): Promise<Checkins[]> => {
      setIsLoading(true)
      try {
        if (!apiUser) return []
        const userDoc = await apiUser.findOne(userId).exec()
        if (!userDoc) return []
        return userDoc.checkins.filter((c) => c.belt === belt && c.stripes === stripes)
      } catch (err) {
        console.error(err)
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const timeUntilNextCheckin = useCallback(
    async (userId: string): Promise<number> => {
      setIsLoading(true)
      try {
        if (!apiUser) return 0
        const userDoc = await apiUser.findOne(userId).exec()
        if (!userDoc || !userDoc.checkins.length) {
          return 0
        }

        const lastTs = userDoc.checkins
          .map((c) => Date.parse(c.checkedAt))
          .reduce((a, b) => Math.max(a, b), 0)
        const now = Date.now()
        const windowMs = 12 * 60 * 60 * 1000

        const elapsed = now - lastTs
        return elapsed >= windowMs ? 0 : windowMs - elapsed
      } catch (err) {
        console.error(err)
        return 0
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  const getNextCheckinTime = useCallback(
    async (userId: string): Promise<string> => {
      setIsLoading(true)
      try {
        if (!apiUser) return ''

        const userDoc = await apiUser.findOne(userId).exec()
        if (!userDoc) {
          return dayjs().format('M/D/YYYY h:mm A')
        }

        const lastTs = userDoc.checkins
          .map((c) => Date.parse(c.checkedAt))
          .reduce((max, cur) => Math.max(max, cur), 0)

        const nextAllowed = dayjs(lastTs).add(12, 'hour')

        if (nextAllowed.isBefore(dayjs())) {
          return dayjs().format('M/D/YYYY h:mm A')
        }

        return nextAllowed.format('M/D/YYYY h:mm A')
      } catch (err) {
        console.error(err)
        return ''
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

  useEffect(() => {
    fetchAllCheckins()
  }, [fetchAllCheckins])

  return {
    isLoading,
    allCheckins,
    checkinLookup,
    fetchAllCheckins,
    fetchCheckinById,
    createCheckin,
    manualCreateCheckin,
    updateCheckin,
    deleteCheckin,
    fetchCheckinsThisMonth,
    fetchCheckinsLastMonth,
    fetchCheckinsAtCurrentRank,
    timeUntilNextCheckin,
    fetchCheckinsByUserId,
    getNextCheckinTime
  }
}
