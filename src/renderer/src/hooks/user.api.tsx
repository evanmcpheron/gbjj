import { useDB } from '@renderer/context/db.context'
import { GreenevilleBJJUser } from '@renderer/types/users.types'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

export const useUserApi = () => {
  const { user: apiUser } = useDB()
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
        setAllUsers(docs?.map((doc) => doc.toJSON()))
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
        console.log(`🚀 ~ user.api.tsx:44 ~ apiUser: \n`, apiUser)

        setUserLookup(null)
        return
      }

      const doc = await apiUser.findOne(id).exec()
      const data = doc ? doc.toJSON() : null
      setUserLookup(data)
      return data
    } catch (err) {
      console.error(err)
      return null
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
        const doc = await apiUser.insert(user as any)
        return doc.toJSON()
      } finally {
        setIsLoading(false)
      }
    },
    [apiUser]
  )

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
    deleteUser
  }
}
