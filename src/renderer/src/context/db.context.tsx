import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { initDb } from '@renderer/db'
import type { RxDatabase } from 'rxdb'

// Define the shape of our context value
interface DBContextType {
  db: RxDatabase | null
  user: RxDatabase['collections']['user'] | null
  checkin: RxDatabase['collections']['checkin'] | null
}

// Create a context with a default empty state
const DBContext = createContext<DBContextType>({
  db: null,
  user: null,
  checkin: null
})

interface DBProviderProps {
  children: ReactNode
}

export const DBProvider: React.FC<DBProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [db, setDb] = useState<RxDatabase | null>(null)

  useEffect(() => {
    initDb()
      .then((createdDb) => {
        console.log(`🚀 ~ db.context.tsx:30 ~ .then ~ createdDb: \n`, createdDb.collections)

        setDb(createdDb)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to initialize DB:', err)
      })
  }, [])

  const value: DBContextType = {
    db,
    user: db?.collections.user ?? null,
    checkin: db?.collections.checkins ?? null
  }

  if (loading) {
    return <div>LOADING</div>
  }

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>
}

// Hook to consume the database context
export function useDB(): DBContextType {
  const context = useContext(DBContext)
  if (context === null) {
    throw new Error('useDB must be used within a DBProvider with an initialized database')
  }
  return context
}
