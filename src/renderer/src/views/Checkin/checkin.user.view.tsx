import { useEffect, useRef, useState } from 'react'
import { Container, Paper, Typography, Alert, Stack } from '@mui/material'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { useNavigate, useParams } from 'react-router-dom'
import { Checkin, GreenevilleBJJUser } from '@renderer/types/users.types'
import { useUserApi } from '@renderer/hooks/user.api'
import { useCheckinApi } from '@renderer/hooks/checkin.api'
import { UserCheckinTable } from './components/user.checkin.table'

export const CheckInUser = () => {
  const clickedRef = useRef(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const checkedInTodayRef = useRef(false)
  const [checkinsThisMonthCount, setCheckinsThisMonthCount] = useState(0)
  const [checkinsLastMonthCount, setCheckinsLastMonthCount] = useState(0)
  const [checkinsAtCurrentRankCount, setCheckinsAtCurrentRankCount] = useState(0)
  const [checkinsThisMonth, setCheckinsThisMonth] = useState<Checkin[]>([])
  const [nextAvailableTime, setNextAvailableTime] = useState('')
  const [user, setUser] = useState<GreenevilleBJJUser | null>(null)
  const { fetchUserById } = useUserApi()
  const {
    fetchThisMonth,
    fetchLastMonth,
    fetchCheckinsByRank,
    timeUntilNextCheckin,
    getNextCheckinTime,
    createCheckin
  } = useCheckinApi()

  const handleCheckIn = async (userToCheckin: GreenevilleBJJUser) => {
    const newCheckin = await createCheckin(
      userToCheckin.id,
      userToCheckin.rank.belt,
      userToCheckin.rank.stripes
    )
    const nextTime = await getNextCheckinTime(userToCheckin.id)
    setNextAvailableTime(nextTime)
    checkedInTodayRef.current = true
    return newCheckin
  }

  const updateCheckin = async () => {
    if (!id) return
    try {
      const responseUser = await fetchUserById(id)

      const [thisMonth, lastMonth] = await Promise.all([
        fetchThisMonth(responseUser.id),
        fetchLastMonth(responseUser.id)
      ])

      const rankChecks = await fetchCheckinsByRank(
        responseUser.id,
        responseUser.rank?.belt,
        responseUser.rank?.stripes
      )

      let thisMonthCount = thisMonth.length
      let lastMonthCount = lastMonth.length
      let rankCount = rankChecks.length

      setUser(responseUser)
      setCheckinsThisMonth(thisMonth)

      const timeLeft = await timeUntilNextCheckin(id)
      if (timeLeft > 0) {
        checkedInTodayRef.current = true
        setNextAvailableTime(await getNextCheckinTime(id))
      } else {
        const newCheckin = await handleCheckIn(responseUser)
        setCheckinsThisMonth((prev) => [newCheckin, ...prev] as Checkin[])
        thisMonthCount += 1
        rankCount += 1
      }

      setCheckinsThisMonthCount(thisMonthCount)
      setCheckinsLastMonthCount(lastMonthCount)
      setCheckinsAtCurrentRankCount(rankCount)
    } catch (err) {
      console.error(err)
    } finally {
    }
  }

  useEffect(() => {
    ;(async () => {
      if (id) {
        setCheckinsThisMonth(await fetchThisMonth(id))
      }
    })()
    const updateTimer = setTimeout(() => {
      if (!clickedRef.current) {
        updateCheckin()
      }
    }, 500)

    const timer = setTimeout(() => {
      if (!clickedRef.current) {
        // navigate('/')
      }
    }, 6000)

    return () => {
      clearTimeout(timer)
      clearTimeout(updateTimer)
    }
  }, [id])

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          {checkedInTodayRef.current && (
            <Alert severity="info" sx={{ width: '100%' }}>
              You can check in again at {nextAvailableTime}.
            </Alert>
          )}

          <Typography variant="h4" align="center">
            Welcome back, {user?.firstName}!
          </Typography>

          <BeltIcon belt={user?.rank.belt} stripes={user?.rank.stripes} scale={3} />

          <Stack
            spacing={1}
            direction="row"
            width="100%"
            sx={{ display: 'flex', justifyContent: 'space-around' }}
          >
            <Typography>
              Classes at Current Rank: <strong>{checkinsAtCurrentRankCount}</strong>
            </Typography>
            <Typography>
              Sessions This Month: <strong>{checkinsThisMonthCount}</strong>
            </Typography>
            <Typography>
              Sessions Last Month: <strong>{checkinsLastMonthCount}</strong>
            </Typography>
          </Stack>

          <UserCheckinTable checkins={checkinsThisMonth} />
        </Stack>
      </Paper>
    </Container>
  )
}
