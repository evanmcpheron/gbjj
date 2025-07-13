import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Container,
  RadioGroup,
  Radio,
  FormControlLabel,
  Stack,
  TablePagination,
  TextField
} from '@mui/material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import ErrorIcon from '@mui/icons-material/Error'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { GreenevilleBJJUser } from '@renderer/types/users.types'
import { useUserApi } from '@renderer/hooks/user.api'
import { useNavigate } from 'react-router-dom'
import { adultFilter } from '@renderer/components/belt/all.belts.component'
import dayjs from 'dayjs'

export default function Members() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterMode, setFilterMode] = useState<'all' | 'adult' | 'female' | 'kids'>('all')
  const [filteredUsers, setFilteredUsers] = useState<GreenevilleBJJUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const { fetchAllUsers, allUsers, isLoading } = useUserApi()

  useEffect(() => {
    fetchAllUsers()
  }, [])

  useEffect(() => {
    let users = [...allUsers]

    if (filterMode === 'adult') {
      users = users.filter((u) => adultFilter(dayjs(u.birthday).toDate()))
    } else if (filterMode === 'female') {
      users = users.filter((u) => u.gender === 'female' && adultFilter(dayjs(u.birthday).toDate()))
    } else if (filterMode === 'kids') {
      users = users.filter((u) => !adultFilter(dayjs(u.birthday).toDate()))
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      users = users.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.phone.toLowerCase().includes(term)
      )
    }

    setFilteredUsers(users)
    setPage(0)
  }, [allUsers, filterMode, searchTerm])

  useEffect(() => {
    setPage(0)
  }, [filteredUsers])

  useEffect(() => {
    setFilteredUsers(allUsers)
  }, [allUsers])

  const navigate = useNavigate()

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <Container>
      <Paper sx={{ mt: 4, width: '100%' }}>
        <TableContainer>
          <Stack direction={'row'} width={'100%'} justifyContent={'space-between'}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Members List
            </Typography>
            <RadioGroup
              row
              defaultValue="all"
              name="radio-buttons-group"
              onChange={(e) => {
                setFilterMode(e.target.value as 'all' | 'adult' | 'female' | 'kids')
              }}
            >
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel value="adult" control={<Radio />} label="Adult" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="kids" control={<Radio />} label="Kids" />
            </RadioGroup>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              sx={{ m: 2, width: '25ch' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Stack>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Signed Waiver</TableCell>
                <TableCell align="center">Promotion Date</TableCell>
                <TableCell align="center">Rank</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Emergency Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user: GreenevilleBJJUser) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell align="left">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell align="left">{user.email}</TableCell>
                      <TableCell align="center">{user.phone}</TableCell>
                      <TableCell align="center">
                        {user.hasSignedWaiver ? (
                          <CheckBoxIcon color="success" />
                        ) : (
                          <ErrorIcon color="error" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {dayjs(new Date(user.rank.promotedAt)).format('MM/DD/YYYY')}
                      </TableCell>
                      <TableCell align="center">
                        <BeltIcon belt={user.rank.belt} stripes={user.rank.stripes} />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/user/${user.id}`)
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/emergency/${user.id}`)
                          }}
                        >
                          EMERGENCY CONTACT
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </Paper>
    </Container>
  )
}
