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
  Switch
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
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import { formatPhoneNumber } from '@renderer/helpers/strings.helper'
import { RankDialog } from './components/promotion.dialog.component'
import { GreenevilleBJJObject } from '@renderer/types/base.types'
import { QrCode2 } from '@mui/icons-material'

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

  // Date range filter state
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [formData, setFormData] = useState<GreenevilleBJJObject>({
    firstName: '',
    lastName: '',
    birthday: new Date(),
    email: '',
    phone: '',
    hasSignedWaiver: false
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

      setAllPromotions(currentUser.promotions)
      setCheckinsThisMonth(currentUser.checkinsThisMonth)
      setCheckinsLastMonth(currentUser.checkinsLastMonth)
      setCheckinsAtCurrentRank(currentUser.checkinsAtRank)

      setUser(currentUser)
      setFormData(currentUser)
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

  const handleSubmit = async () => {
    if (!id || !user) return
    const transformedData = {
      ...formData,
      birthday: dayjs(formData.birthday).toISOString()
    }

    delete transformedData.rank

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

        <Grid>
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
            <FormControlLabel
              control={
                <Switch
                  checked={formData.hasSignedWaiver}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hasSignedWaiver: e.target.checked }))
                  }
                />
              }
              label="Signed Waiver"
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
          <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
            Save Changes
          </Button>
        </Stack>

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
                {adultOrChildBelt(dayjs(formData.birthday).toDate()).map((belt, index) => (
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
