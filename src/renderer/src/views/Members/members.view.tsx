import { useState, useEffect, useRef } from 'react'
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
import { EditMemberDialog } from './members.promote.dialog.component'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { GreenevilleBJJUser } from '@renderer/types/users.types'
import { useUserApi } from '@renderer/hooks/user.api'
import { useNavigate } from 'react-router-dom'
import { adultFilter } from '@renderer/components/belt/all.belts.component'
import dayjs from 'dayjs'

export default function Members() {
  const [showPromotionDialog, setShowPromotionDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<GreenevilleBJJUser | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filteredUsers, setFilteredUsers] = useState<GreenevilleBJJUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const { fetchAllUsers, allUsers, isLoading } = useUserApi()

  useEffect(() => {
    fetchAllUsers()
  }, [selectedMember])

  useEffect(() => {
    let users = [...filteredUsers]

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      users = users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term)
      )
    }

    setFilteredUsers(users)
  }, [searchTerm, allUsers])

  useEffect(() => {
    setPage(0)
  }, [filteredUsers])

  useEffect(() => {
    setFilteredUsers(allUsers)
  }, [allUsers])

  const navigate = useNavigate()

  const handleCloseDialog = () => {
    setShowPromotionDialog(false)
    setSelectedMember(null)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0) // reset to first page
  }

  const handleFilter = (filter: string) => {
    if (filter === 'all') {
      setFilteredUsers(allUsers)
    } else if (filter === 'adult') {
      setFilteredUsers(() =>
        allUsers.filter((user) => {
          return adultFilter(dayjs(user.birthday).toDate())
        })
      )
    } else if (filter === 'female') {
      setFilteredUsers(() =>
        allUsers.filter((user) => {
          return user.gender === 'female' && adultFilter(dayjs(user.birthday).toDate())
        })
      )
    } else {
      setFilteredUsers(() =>
        allUsers.filter((user) => {
          return !adultFilter(dayjs(user.birthday).toDate())
        })
      )
    }
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
                handleFilter(e.target.value)
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
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">Rank</TableCell>
                <TableCell align="left">Actions</TableCell>
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
                      <TableCell align="left">{user.phone}</TableCell>
                      <TableCell align="left">
                        <BeltIcon belt={user.belt} stripes={user.stripes} />
                      </TableCell>
                      <TableCell align="left">
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
      {selectedMember && (
        <EditMemberDialog
          open={showPromotionDialog}
          selectedMember={selectedMember}
          handleClose={handleCloseDialog}
        />
      )}
    </Container>
  )
}
