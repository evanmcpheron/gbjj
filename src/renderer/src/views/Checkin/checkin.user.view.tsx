import { useEffect, useRef, useState } from 'react'
import { Container, Paper, Typography, Alert, Stack, Button } from '@mui/material'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { useNavigate, useParams } from 'react-router-dom'
import { BeltColor, Checkins, GreenevilleBJJUser } from '@renderer/types/users.types'
import { useUserApi } from '@renderer/hooks/user.api'
import { useCheckinApi } from '@renderer/hooks/checkin.api'
import { UserCheckinTable } from './components/user.checkin.table'

export const CheckInUser = () => {
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [monthToDateCheckins, setMonthToDateCheckins] = useState(0)
  const [lastMonthCheckins, setLastMonthCheckins] = useState(0)
  const [checkinsByRank, setCheckinsByRank] = useState(0)
  const [nextAvailableTime, setNextAvailableTime] = useState('')
  const [thisMonthsCheckins, setThisMonthsCheckins] = useState<Checkins[]>([])
  const [user, setUser] = useState<GreenevilleBJJUser>({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    birthday: new Date().toISOString(),
    email: 'bjj@email.com',
    phone: '123-123-1234',
    belt: BeltColor.WHITE,
    stripes: 0,
    checkins: []
  })
  const clickedRef = useRef(false)
  const { id } = useParams()
  const navigate = useNavigate()

  const { fetchUserById } = useUserApi()
  const {
    createCheckin,
    fetchCheckinsThisMonth,
    fetchCheckinsLastMonth,
    fetchCheckinsAtCurrentRank,
    timeUntilNextCheckin,
    getNextCheckinTime,
    isLoading
  } = useCheckinApi()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!clickedRef.current) {
        navigate('/')
      }
    }, 5000)

    const loadData = async () => {
      if (!id) return

      const response = await fetchUserById(id)

      setUser(response)
      const thisMonth = await fetchCheckinsThisMonth(id)
      setThisMonthsCheckins(thisMonth)
      const lastMonth = await fetchCheckinsLastMonth(id)
      const rankChecks = await fetchCheckinsAtCurrentRank(id, response.belt, response.stripes)
      timeUntilNextCheckin(id).then(async (value) => {
        setCheckedInToday(value > 0)
        if (value > 0) {
          const nextTime = await getNextCheckinTime(id)
          setNextAvailableTime(nextTime)
        }
      })
      setMonthToDateCheckins(thisMonth.length)
      setLastMonthCheckins(lastMonth.length)
      setCheckinsByRank(rankChecks.length)
    }
    loadData()
    return () => clearTimeout(timer)
  }, [id])

  const handleCheckIn = async () => {
    await createCheckin(user.id, {
      belt: user.belt,
      stripes: user.stripes
    })
    const nextTime = await getNextCheckinTime(user.id)
    setNextAvailableTime(nextTime)
    setCheckedInToday(true)
    setCheckinsByRank((prev) => prev + 1)
    setMonthToDateCheckins((prev) => prev + 1)
  }

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

          <BeltIcon belt={user.belt} stripes={user.stripes} scale={3} />

          <Stack spacing={1} width="100%">
            <Typography>
              Classes at Current Rank: <strong>{checkinsByRank}</strong>
            </Typography>
            <Typography>
              Sessions This Month: <strong>{monthToDateCheckins}</strong>
            </Typography>
            <Typography>
              Sessions Last Month: <strong>{lastMonthCheckins}</strong>
            </Typography>
          </Stack>

          <Button variant="contained" fullWidth onClick={() => navigate('/')}>
            Done
          </Button>

          <UserCheckinTable checkins={thisMonthsCheckins} />
        </Stack>
      </Paper>
    </Container>
  )
}
