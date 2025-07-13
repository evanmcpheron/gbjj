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
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  FormHelperText
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import { useCheckinApi } from '@renderer/hooks/checkin.api'
import { useEffect, useState } from 'react'
import { usePromotionApi, useUserApi } from '@renderer/hooks/user.api'
import { BeltColor, Checkin, GreenevilleBJJUser, Promotion } from '@renderer/types/users.types'
import { adultOrChildBelt } from '@renderer/components/belt/all.belts.component'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import dayjs from 'dayjs'
import { UserCheckinTable } from '../Checkin/components/user.checkin.table'
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { formatPhoneNumber } from '@renderer/helpers/strings.helper'
import { RankDialog } from './components/promotion.dialog.component'
import { QrCode2 } from '@mui/icons-material'
import { joiResolver } from '@hookform/resolvers/joi'
import { Controller, useForm } from 'react-hook-form'
import { formSchema } from './user.edit.logic'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

type FormValues = {
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  email: string
  phone: string
  birthday: Date
  hasSignedWaiver: boolean
}

export const UserEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    fetchThisMonth,
    fetchCheckinsByRank,
    fetchCheckinsByUser,
    manualCreateCheckin,
    deleteCheckin
  } = useCheckinApi()

  const { fetchUserById, updateUser, deleteUser, isLoading } = useUserApi()

  const { fetchPromotions, deletePromotion } = usePromotionApi()

  const [user, setUser] = useState<GreenevilleBJJUser | null>(null)
  const [allCheckins, setAllCheckins] = useState<Checkin[]>([])
  const [checkinsThisMonth, setCheckinsThisMonth] = useState<Checkin[]>([])
  const [checkinsLastMonth, setCheckinsLastMonth] = useState<Checkin[]>([])
  const [checkinsAtCurrentRank, setCheckinsAtCurrentRank] = useState<Checkin[]>([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [manualCheckinOpen, setManualCheckinOpen] = useState(false)
  const [openRankDialog, setOpenRankDialog] = useState(false)
  const [allPromotions, setAllPromotions] = useState<Promotion[]>([])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: joiResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'male',
      email: '',
      phone: '',
      birthday: new Date(),
      hasSignedWaiver: false
    }
  })

  const watchedBirthday = watch('birthday')

  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  const [manualCheckinForm, setManualCheckinForm] = useState({
    belt: BeltColor.WHITE,
    stripes: 0,
    checkedAt: new Date()
  })

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const currentUser = await fetchUserById(id)

      setAllPromotions(currentUser.promotions)
      setCheckinsThisMonth(currentUser.checkinsThisMonth)
      setCheckinsLastMonth(currentUser.checkinsLastMonth)
      setCheckinsAtCurrentRank(currentUser.checkinsAtRank)

      setUser(currentUser)
      reset({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        gender: currentUser.gender,
        email: currentUser.email,
        phone: currentUser.phone,
        birthday: new Date(currentUser.birthday),
        hasSignedWaiver: currentUser.hasSignedWaiver
      })

      setManualCheckinForm((prev) => ({
        ...prev,
        belt: currentUser.rank.belt,
        stripes: currentUser.rank.stripes
      }))

      const checks = await fetchCheckinsByUser(id)
      setAllCheckins(checks)
    })()
  }, [id])

  const handleGoBack = () => navigate('/members')

  const handleDeletePromotion = async (promotionId: string) => {
    await deletePromotion(promotionId)
  }

  const handleFilter = async () => {
    if (!id) return
    const filtered = await fetchCheckinsByUser(id, fromDate || undefined, toDate || undefined)
    setAllCheckins(filtered)
  }

  const onSubmit = async (data: FormValues) => {
    if (!id || !user) return
    const transformedData = {
      ...data,
      birthday: dayjs(data.birthday).toISOString()
    }

    await updateUser(id, transformedData)

    navigate('/members')
  }

  if (isLoading) return <Typography align="center">Loading…</Typography>

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, position: 'relative' }}>
        <Box>
          <Button
            onClick={handleGoBack}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ position: 'absolute', top: 16, left: 16 }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            sx={{ position: 'absolute', top: 16, right: 16 }}
            onClick={() => {
              navigate(`/qr/${id}`)
            }}
          >
            <QrCode2 sx={{ fontSize: 40 }} />
          </Button>
        </Box>

        <Typography variant="h4" align="center" gutterBottom>
          Edit Member
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid>
            <Typography variant="h6" gutterBottom>
              Personal Info
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" gap={3}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message || ' '}
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message || ' '}
                    />
                  )}
                />
              </Box>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" error={!!errors.gender} sx={{ my: 2 }}>
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup row {...field}>
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                    <FormHelperText>{errors.gender?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message || ' '}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    type="tel"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    value={field.value}
                    onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                    error={!!errors.phone}
                    helperText={errors.phone?.message || ' '}
                  />
                )}
              />
              <Controller
                name="birthday"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Birthday"
                      value={dayjs(field.value)}
                      onChange={(d) => {
                        if (d?.isValid()) {
                          field.onChange(d.toDate())
                        }
                      }}
                      slotProps={{
                        textField: {
                          margin: 'normal',
                          required: true,
                          fullWidth: true,
                          error: !!errors.birthday,
                          helperText: errors.birthday?.message || ' '
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              />

              <Controller
                name="hasSignedWaiver"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    sx={{ my: 2 }}
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Signed Waiver"
                  />
                )}
              />
            </Stack>
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

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              Save Changes
            </Button>
          </Stack>
        </Box>
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
          <Stack direction="row" width={'100%'} justifyContent={'space-around'} my={4}>
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
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            flexWrap="wrap"
            mb={2}
          >
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
                await deleteCheckin(checkinId)
                if (!user) return
                const thisMonth = await fetchThisMonth(user.id)

                setCheckinsThisMonth(thisMonth)

                const currentRank = await fetchCheckinsByRank(
                  user.id,
                  user.rank.belt,
                  user.rank.stripes
                )
                setCheckinsAtCurrentRank(currentRank)
                const checks = await fetchCheckinsByUser(id!)
                setAllCheckins(checks)
              } catch (error) {
                console.error(error)
              }
            }}
          />
        </Paper>
        <Paper sx={{ mt: 4, p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            mb={2}
          >
            <Typography variant="h6" gutterBottom>
              Promotions
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                mt: 3,
                width: '100%',
                height: 400,
                marginBottom: '10px',
                overflow: 'auto'
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Promotion Date</TableCell>
                    <TableCell>Belt</TableCell>
                    <TableCell>Stripes</TableCell>
                    {!!handleDeletePromotion && (
                      <TableCell align="right">
                        <IconButton onClick={() => console.log('Delete clicked')} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {allPromotions.map((row: Promotion, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{dayjs(new Date(row.promotedAt)).format('MM/DD/YYYY')}</TableCell>
                      <TableCell>
                        <BeltIcon belt={row.belt} stripes={row.stripes} />
                      </TableCell>
                      <TableCell>{row.stripes}</TableCell>

                      <TableCell align="right">
                        <IconButton
                          disabled={allPromotions.length === 1}
                          onClick={async (e) => {
                            e.stopPropagation()
                            if (!user) return
                            await handleDeletePromotion(row.id)

                            const allPromotionsResponse = await fetchPromotions({ userId: user.id })

                            setAllPromotions(allPromotionsResponse)
                          }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setOpenRankDialog(true)
              }}
            >
              Promote
            </Button>
            {openRankDialog && user && (
              <RankDialog
                open={openRankDialog}
                user={user}
                onClose={() => setOpenRankDialog(false)}
                onSave={async () => {
                  if (!user) return
                  const allPromotionsResponse = await fetchPromotions({ userId: user.id })
                  setAllPromotions(allPromotionsResponse)
                  setOpenRankDialog(false)
                }}
              />
            )}
          </Stack>
        </Paper>
      </Paper>

      {manualCheckinOpen && (
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
                onChange={(e) =>
                  setManualCheckinForm((prev) => ({ ...prev, belt: e.target.value }))
                }
              >
                {adultOrChildBelt(dayjs(watchedBirthday).toDate()).map((belt, index) => (
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
                      defaultValue={manualCheckinForm.stripes}
                      name="stripes"
                      row
                      onChange={(e) =>
                        setManualCheckinForm((prev) => ({
                          ...prev,
                          stripes: parseInt(e.target.value)
                        }))
                      }
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
              <Button
                onClick={() => setManualCheckinOpen(false)}
                variant="outlined"
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  try {
                    if (!id) return
                    await manualCreateCheckin(
                      id!,
                      manualCheckinForm.belt,
                      manualCheckinForm.stripes,
                      dayjs(manualCheckinForm.checkedAt).toISOString()
                    )

                    const thisMonth = await fetchThisMonth(id)
                    setCheckinsThisMonth(thisMonth)

                    const currentRank = await fetchCheckinsByRank(
                      id,
                      manualCheckinForm.belt,
                      manualCheckinForm.stripes
                    )
                    setCheckinsAtCurrentRank(currentRank)
                    const checks = await fetchCheckinsByUser(id!)
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
      )}

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
