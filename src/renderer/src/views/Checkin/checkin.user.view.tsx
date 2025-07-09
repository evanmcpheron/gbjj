import { useEffect, useRef, useState } from 'react'
import { Container, Paper, Typography, Alert, Stack, Button } from '@mui/material'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { useNavigate, useParams } from 'react-router-dom'
import { BeltColor, Checkins, GreenevilleBJJUser } from '@renderer/types/users.types'
import { useUserApi } from '@renderer/hooks/user.api'
import { useCheckinApi } from '@renderer/hooks/checkin.api'
import { UserCheckinTable } from './components/user.checkin.table'

export const CheckInUser = () => {
  const clickedRef = useRef(false)
  const { id } = useParams()
  const navigate = useNavigate()
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
    if (!id) return

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
    const timer = setTimeout(() => {
      if (!clickedRef.current) {
        navigate('/')
      }
    }, 6000)

    return () => clearTimeout(timer)
  }, [id])

  useEffect(() => {
    updateCheckin()
  }, [isLoading])

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          {checkedInToday && (
            <Alert severity="info" sx={{ width: '100%' }}>
              You already checked in today.{' '}
              <div>You can check in again at {nextAvailableTime}.</div>
            </Alert>
          )}

          <Typography variant="h4" align="center">
            Welcome back, {user?.firstName}!
          </Typography>

          <BeltIcon belt={user?.belt} stripes={user?.stripes} scale={3} />

          <Stack
            spacing={1}
            direction="row"
            width="100%"
            sx={{ display: 'flex', justifyContent: 'space-around' }}
          >
            <Typography>
              Classes at Current Rank: <strong>{checkinsAtCurrentRank.length}</strong>
            </Typography>
            <Typography>
              Sessions This Month: <strong>{checkinsThisMonth.length}</strong>
            </Typography>
            <Typography>
              Sessions Last Month: <strong>{checkinsLastMonth.length}</strong>
            </Typography>
          </Stack>

          {/* {checkedInToday && (
            <Button variant="contained" fullWidth onClick={() => navigate('/')}>
              Done
            </Button>
          )} */}

          <UserCheckinTable checkins={checkinsThisMonth} />
        </Stack>
      </Paper>
    </Container>
  )
}
