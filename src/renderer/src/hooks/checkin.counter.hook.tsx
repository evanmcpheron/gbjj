import { useEffect, useState } from 'react'
import { useCheckinApi } from './checkin.api'
import { useUserApi } from './user.api'
import { Checkins, GreenevilleBJJUser } from '@renderer/types/users.types'

export const useCheckinCounter = (id: string) => {
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [checkinsThisMonth, setCheckinsThisMonth] = useState<Checkins[]>([])
  const [checkinsLastMonth, setCheckinsLastMonth] = useState<Checkins[]>([])
  const [checkinsAtCurrentRank, setCheckinsAtCurrentRank] = useState<Checkins[]>([])
  const [nextAvailableTime, setNextAvailableTime] = useState('')
  const [user, setUser] = useState<GreenevilleBJJUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { fetchUserById } = useUserApi()
  const {
    fetchCheckinsThisMonth,
    fetchCheckinsLastMonth,
    fetchCheckinsAtCurrentRank,
    timeUntilNextCheckin,
    getNextCheckinTime,
    createCheckin
  } = useCheckinApi()

  const handleCheckIn = async (userToCheckin: GreenevilleBJJUser) => {
    await createCheckin(userToCheckin.id, {
      belt: userToCheckin.belt,
      stripes: userToCheckin.stripes
    })
    const nextTime = await getNextCheckinTime(userToCheckin.id)
    setNextAvailableTime(nextTime)
    setCheckedInToday(true)
  }

  const updateCheckin = async () => {
    const responseUser = await fetchUserById(id)
    const thisMonth = await fetchCheckinsThisMonth(responseUser.id)
    const lastMonth = await fetchCheckinsLastMonth(responseUser.id)
    const rankChecks = await fetchCheckinsAtCurrentRank(
      responseUser.id,
      responseUser.belt,
      responseUser.stripes
    )

    setUser(responseUser)
    setCheckinsThisMonth(thisMonth)
    setCheckinsLastMonth(lastMonth)
    setCheckinsAtCurrentRank(rankChecks)

    timeUntilNextCheckin(id)
      .then(async (value) => {
        setCheckedInToday(value > 0)
        if (value > 0) {
          const nextTime = await getNextCheckinTime(id)
          setNextAvailableTime(nextTime)
        } else {
          console.log('checking in')
          handleCheckIn(responseUser)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    updateCheckin()
  }, [id])

  return {
    checkinsThisMonth,
    checkinsLastMonth,
    checkinsAtCurrentRank,
    updateCheckin,
    nextAvailableTime,
    checkedInToday,
    isLoading,
    user
  }
}
