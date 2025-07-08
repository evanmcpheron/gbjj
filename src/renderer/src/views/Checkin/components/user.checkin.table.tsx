import { BeltIcon } from '@renderer/components/belt/belt.component'
import { Checkins } from '@renderer/types/users.types'
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import dayjs from 'dayjs'

export const UserCheckinTable = ({ checkins }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Time</TableCell>
            <TableCell align="left">Rank</TableCell>

            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checkins.map((checkin: Checkins) => {
            const day = dayjs(checkin.checkedAt).format('dddd')
            const date = dayjs(checkin.checkedAt).format('M/D/YYYY')
            const time = dayjs(checkin.checkedAt).format('h:m A')
            return (
              <TableRow key={checkin.id}>
                <TableCell align="left">
                  {day}, {date}
                </TableCell>
                <TableCell align="left">{time}</TableCell>
                <TableCell align="left">
                  <BeltIcon belt={checkin.belt} stripes={checkin.stripes} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
