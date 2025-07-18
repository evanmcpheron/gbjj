import { useState } from 'react'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import DeleteIcon from '@mui/icons-material/Delete'
import { Checkin } from '@renderer/types/users.types'
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material'
import dayjs from 'dayjs'
import { StyledPagination } from '@renderer/views/Members/members.view'
import { theme } from '@renderer/App'

interface UserCheckinTableProps {
  checkins: Checkin[]
  handleDeleteCheckin?: (id: string) => void
}

export const UserCheckinTable = ({ checkins, handleDeleteCheckin }: UserCheckinTableProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedCheckins = checkins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Paper sx={{ mt: 4, width: '100%' }}>
      <TableContainer sx={{ height: 400, overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Time</TableCell>
              <TableCell align="left">Rank</TableCell>
              {!!handleDeleteCheckin && (
                <TableCell align="right">
                  <IconButton onClick={() => console.log('Delete clicked')} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCheckins.map((checkin: Checkin) => {
              const day = dayjs(checkin.checkedAt).format('dddd')
              const date = dayjs(checkin.checkedAt).format('M/D/YYYY')
              const time = dayjs(checkin.checkedAt).format('h:mm A')

              return (
                <TableRow key={checkin.id}>
                  <TableCell align="left">
                    {day}, {date}
                  </TableCell>
                  <TableCell align="left">{time}</TableCell>
                  <TableCell align="left">
                    <BeltIcon belt={checkin.belt} stripes={checkin.stripes} />
                  </TableCell>
                  {!!handleDeleteCheckin && (
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCheckin?.(checkin.id)
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <StyledPagination
        theme={theme}
        count={checkins.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Paper>
  )
}
