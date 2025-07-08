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
  IconButton,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material'
import { PromoteMemberDialog } from './members.promote.dialog.component'
import DeleteIcon from '@mui/icons-material/Delete'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { GreenevilleBJJUser } from '@renderer/types/users.types'
import { useUserApi } from '@renderer/hooks/user.api'

export default function Members() {
  const [showPromotionDialog, setShowPromotionDialog] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const deleteMemberByIdRef = useRef('')
  const [selectedMember, setSelectedMember] = useState<GreenevilleBJJUser | null>(null)

  const { fetchAllUsers, allUsers, isLoading, deleteUser } = useUserApi()

  useEffect(() => {
    fetchAllUsers()
  }, [selectedMember])

  const handlePromote = (member: GreenevilleBJJUser) => {
    setSelectedMember(member)
    setShowPromotionDialog(true)
  }

  const handleCloseDialog = () => {
    setShowPromotionDialog(false)
    setSelectedMember(null)
  }

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Members List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Phone</TableCell>
              <TableCell align="left">Rank</TableCell>
              <TableCell align="left">Actions</TableCell>

              <TableCell align="right">
                <DeleteIcon />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUsers.map((user: GreenevilleBJJUser) => {
              return (
                <TableRow key={user.id}>
                  <TableCell align="left">
                    {user.firstName} {user.id}
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
                        handlePromote(user)
                      }}
                    >
                      Promote
                    </Button>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMemberByIdRef.current = user.id
                        setShowDeleteConfirmation(true)
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={showDeleteConfirmation}>
        <DialogContent>
          Are you sure you want to delete this user? This cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              deleteUser(deleteMemberByIdRef.current)
                .then(() => {
                  fetchAllUsers()
                })
                .finally(() => {
                  deleteMemberByIdRef.current = ''
                  setShowDeleteConfirmation(false)
                })
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {selectedMember && (
        <PromoteMemberDialog
          open={showPromotionDialog}
          selectedMember={selectedMember}
          handleClose={handleCloseDialog}
        />
      )}
    </>
  )
}
