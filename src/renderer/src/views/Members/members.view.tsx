import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Typography,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  Stack,
  Theme
} from '@mui/material'
import styled from '@emotion/styled'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import ErrorIcon from '@mui/icons-material/Error'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { GreenevilleBJJUser } from '@renderer/types/users.types'
import { useUserApi } from '@renderer/hooks/user.api'
import { useNavigate } from 'react-router-dom'
import { adultFilter } from '@renderer/components/belt/all.belts.component'
import dayjs from 'dayjs'
import { theme } from '@renderer/App'

// Styled Components
const StyledContainer = styled(Container)<{ theme: Theme }>`
  padding-top: ${({ theme }) => theme.spacing(4)};
`

const StyledPaper = styled(Paper)<{ theme: Theme }>`
  margin-top: ${({ theme }) => theme.spacing(4)};
  width: 100%;
`

const FilterBar = styled(Stack)<{ theme: Theme }>`
  flex-wrap: wrap;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(2)};
`

const StyledSearchField = styled(TextField)<{ theme: Theme }>`
  margin: ${({ theme }) => theme.spacing(2)};
  width: 25ch;
`

const StyledTableContainer = styled(TableContainer)`
  max-height: 500px;
`

export const StyledPagination = styled(TablePagination)<{ theme: Theme }>`
  & .MuiTablePagination-toolbar {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`

export default function Members() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterMode, setFilterMode] = useState<'all' | 'adult' | 'female' | 'kids'>('all')
  const [filteredUsers, setFilteredUsers] = useState<GreenevilleBJJUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const { fetchAllUsers, allUsers, isLoading } = useUserApi()
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllUsers()
  }, [])

  // Filter and search users
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

  useEffect(() => setPage(0), [filteredUsers])
  useEffect(() => setFilteredUsers(allUsers), [allUsers])

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  if (isLoading) {
    return <CircularProgress />
  }

  const paginated = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <StyledContainer theme={theme}>
      <StyledPaper theme={theme}>
        <FilterBar theme={theme} direction="row">
          <Typography variant="h6">Members List</Typography>
          <RadioGroup row defaultValue="all" onChange={(e) => setFilterMode(e.target.value as any)}>
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="adult" control={<Radio />} label="Adult" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="kids" control={<Radio />} label="Kids" />
          </RadioGroup>
          <StyledSearchField
            theme={theme}
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FilterBar>

        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Signed Waiver</TableCell>
                <TableCell align="center">Promotion Date</TableCell>
                <TableCell align="center">Rank</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Emergency Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">{user.phone}</TableCell>
                  <TableCell align="center">
                    {user.hasSignedWaiver ? (
                      <CheckBoxIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(user.rank.promotedAt).format('MM/DD/YYYY')}
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
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <StyledPagination
          theme={theme}
          count={filteredUsers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </StyledPaper>
    </StyledContainer>
  )
}
