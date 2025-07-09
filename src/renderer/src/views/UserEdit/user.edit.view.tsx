import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Typography,
  Stack,
  TextField,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useCheckinApi } from '@renderer/hooks/checkin.api'
import { useEffect, useState } from 'react'
import { useUserApi } from '@renderer/hooks/user.api'
import { BeltColor, Checkins, GreenevilleBJJUser } from '@renderer/types/users.types'
import { isAdult } from '@renderer/components/belt/all.belts.component'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import dayjs from 'dayjs'
import { UserCheckinTable } from '../Checkin/components/user.checkin.table'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import { formatPhoneNumber } from '@renderer/helpers/strings.helper'

export const UserEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    fetchCheckinsThisMonth,
    fetchCheckinsLastMonth,
    fetchCheckinsAtCurrentRank,
    fetchCheckinsByUserId,
    manualCreateCheckin,
    deleteCheckin
  } = useCheckinApi()

  const { fetchUserById, updateUser, deleteUser, isLoading } = useUserApi()

  const [user, setUser] = useState<GreenevilleBJJUser | null>(null)
  const [allCheckins, setAllCheckins] = useState<Checkins[]>([])
  const [checkinsThisMonth, setCheckinsThisMonth] = useState<Checkins[]>([])
  const [checkinsLastMonth, setCheckinsLastMonth] = useState<Checkins[]>([])
  const [checkinsAtCurrentRank, setCheckinsAtCurrentRank] = useState<Checkins[]>([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [manualCheckinOpen, setManualCheckinOpen] = useState(false)
  const [stripes, setStripes] = useState(0)
  const [belt, setBelt] = useState(BeltColor.WHITE)

  // Date range filter state
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthday: new Date(),
    email: '',
    phone: ''
  })
  const [manualCheckinForm, setManualCheckinForm] = useState({
    belt: BeltColor.WHITE,
    stripes: 0,
    checkedAt: new Date()
  })

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const currentUser = await fetchUserById(id)

      const thisMonth = await fetchCheckinsThisMonth(id)
      setCheckinsThisMonth(thisMonth)

      const lastMonth = await fetchCheckinsLastMonth(id)
      setCheckinsLastMonth(lastMonth)

      const currentRank = await fetchCheckinsAtCurrentRank(
        id,
        currentUser.belt,
        currentUser.stripes
      )
      setCheckinsAtCurrentRank(currentRank)
      setUser(currentUser)
      setFormData(currentUser)
      setManualCheckinForm((prev) => ({
        ...prev,
        belt: currentUser.belt,
        stripes: currentUser.stripes
      }))
      setStripes(currentUser.stripes)
      setBelt(currentUser.belt)
      const checks = await fetchCheckinsByUserId(id)
      setAllCheckins(checks)
    })()
  }, [id])

  const handleGoBack = () => navigate('/members')

  const handleFilter = async () => {
    if (!id) return
    const filtered = await fetchCheckinsByUserId(id, fromDate || undefined, toDate || undefined)
    setAllCheckins(filtered)
  }

  const handleSubmit = async () => {
    if (!id || !user) return
    await updateUser(id, {
      ...formData,
      birthday: dayjs(formData.birthday).toISOString(),
      belt,
      stripes
    })
    navigate('/members')
  }

  if (isLoading) return <Typography align="center">Loading…</Typography>

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, position: 'relative' }}>
        <Button
          onClick={handleGoBack}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ position: 'absolute', top: 16, left: 16 }}
        >
          Go Back
        </Button>

        <Typography variant="h4" align="center" gutterBottom>
          Edit Member
        </Typography>

        <Grid container spacing={3}>
          <Grid sx={{ width: '50%' }}>
            <Typography variant="h6" gutterBottom>
              Personal Info
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))
                }
                fullWidth
              />
              <DatePicker
                label="Birthday"
                value={dayjs(formData.birthday)}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    birthday: value?.toDate() || new Date()
                  }))
                }}
              />
            </Stack>
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid columns={6}>
            <Typography variant="h6" gutterBottom>
              Rank Info
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Belt</InputLabel>
              <Select
                label="Belt"
                value={belt}
                onChange={(e) => setBelt(e.target.value as BeltColor)}
              >
                {isAdult(dayjs(formData.birthday).toDate()).map((b) => (
                  <MenuItem key={b} value={b}>
                    <BeltIcon belt={b} /> {b}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormLabel>Stripes</FormLabel>
            <RadioGroup row value={stripes} onChange={(e) => setStripes(Number(e.target.value))}>
              {Array.from({ length: belt === BeltColor.BLACK ? 7 : 5 }).map((_, i) => (
                <FormControlLabel key={i} value={i} control={<Radio />} label={i} />
              ))}
            </RadioGroup>
            <Stack direction={'column'}>
              {user && (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Typography>Current Belt</Typography>
                  <BeltIcon belt={user?.belt} stripes={user?.stripes} scale={3} />
                </div>
              )}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography>New Belt</Typography>
                <BeltIcon belt={belt} stripes={stripes} scale={3} />
              </div>
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
          <Button
            color="error"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            Delete User
          </Button>
          <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
            Save Changes
          </Button>
        </Stack>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => {
            navigate(`/qr/${id}`)
          }}
        >
          Generate QR Code
        </Button>

        <Paper sx={{ mt: 4, p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            mb={2}
          >
            <Typography variant="h6" gutterBottom>
              Check-in History
            </Typography>
            <Button variant="contained" color="primary" onClick={() => setManualCheckinOpen(true)}>
              Manual Checkin
            </Button>
          </Stack>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            flexWrap="wrap"
            mb={2}
          >
            <Stack direction="row" spacing={3}>
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

            <Stack direction="row" spacing={2} alignItems="flex-end">
              <Stack spacing={0.5}>
                <FormLabel>From</FormLabel>
                <TextField
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  size="small"
                />
              </Stack>
              <Stack spacing={0.5}>
                <FormLabel>To</FormLabel>
                <TextField
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  size="small"
                />
              </Stack>
              <Button variant="outlined" onClick={handleFilter}>
                Apply
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <UserCheckinTable
            checkins={allCheckins}
            handleDeleteCheckin={async (checkinId: string) => {
              try {
                await deleteCheckin(user!.id, checkinId)
                const checks = await fetchCheckinsByUserId(id!)
                setAllCheckins(checks)
              } catch (error) {
                console.error(error)
              }
            }}
          />
        </Paper>
      </Paper>
      <Dialog open={manualCheckinOpen} onClose={() => setManualCheckinOpen(false)}>
        <DialogTitle>Manual Checkin</DialogTitle>
        <DialogContent>
          <Typography>Rank</Typography>
          <FormControl fullWidth>
            <InputLabel id="belt-rank">Belt</InputLabel>
            <Select
              labelId="belt-rank"
              id="belt-rank"
              value={manualCheckinForm.belt}
              label="Belt"
              onChange={(e) => console.log(e.target.value)}
            >
              {isAdult(dayjs(formData.birthday).toDate()).map((belt, index) => (
                <MenuItem key={index} value={belt}>
                  <BeltIcon belt={belt} />
                </MenuItem>
              ))}
            </Select>
            {manualCheckinForm.belt !== BeltColor.RED &&
              manualCheckinForm.belt !== BeltColor.RED_WHITE &&
              manualCheckinForm.belt !== BeltColor.RED_BLACK && (
                <>
                  <FormLabel id="stripes">Stripes</FormLabel>
                  <RadioGroup
                    aria-labelledby="stripes"
                    defaultValue={user?.stripes}
                    name="stripes"
                    row
                    onChange={(e) => console.log(e.target.value)}
                  >
                    {Array.from(
                      { length: manualCheckinForm.belt === BeltColor.BLACK ? 7 : 5 },
                      (_value, index) => (
                        <FormControlLabel
                          key={index}
                          value={index}
                          control={<Radio />}
                          label={index}
                        />
                      )
                    )}
                  </RadioGroup>
                </>
              )}
            <DateTimePicker
              label="Checkin Date"
              value={dayjs(manualCheckinForm.checkedAt)}
              onChange={(value) =>
                setManualCheckinForm((prev) => ({
                  ...prev,
                  checkedAt: value?.toDate() || new Date()
                }))
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" width={'100%'}>
            <Button onClick={() => setManualCheckinOpen(false)} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  await manualCreateCheckin(id!, {
                    checkedAt: dayjs(manualCheckinForm.checkedAt).toISOString(),
                    belt: manualCheckinForm.belt,
                    stripes: manualCheckinForm.stripes
                  })
                  const checks = await fetchCheckinsByUserId(id!)
                  setAllCheckins(checks)
                  setManualCheckinOpen(false)
                } catch (error) {
                  console.error(error)
                }
              }}
              variant="contained"
            >
              Checkin
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <DialogContentText>
            Deleting this user <strong>CANNOT</strong> be undone. <br /> Proceed with caution.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" width={'100%'}>
            <Button onClick={() => setConfirmDeleteOpen(false)} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                deleteUser(id!)
                navigate('/members')
                setConfirmDeleteOpen(false)
              }}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
