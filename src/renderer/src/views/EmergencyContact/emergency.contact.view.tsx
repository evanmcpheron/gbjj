// EmergencyContactsTable.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
  Container,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import DeleteIcon from '@mui/icons-material/Delete'
import dayjs from 'dayjs'
import { EmergencyContact } from '@renderer/types/users.types'
import { CreateEmergencyContactDialog } from './emergency.contact.dialog'
import { useNavigate, useParams } from 'react-router-dom'
import { useDB } from '@renderer/context/db.context'
import { v4 as uuid } from 'uuid'

function useContactApi() {
  const { emergencyContact: apiEmergencyContact } = useDB()

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])

  const fetchEmergencyContacts = async (userId: string) => {
    try {
      if (!apiEmergencyContact) {
        setEmergencyContacts([])
        return []
      }

      const docs = await apiEmergencyContact
        .find()
        .where('userId')
        .eq(userId)
        .sort({ isPrimaryContact: 'desc' })
        .exec()

      const data = docs ? docs : []

      setEmergencyContacts(data)
      return data
    } catch (err) {
      console.error(err)
      setEmergencyContacts([])
      return []
    }
  }
  const createEmergencyContacts = async (
    userId: string,
    emergencyContact: Partial<EmergencyContact>
  ) => {
    if (!apiEmergencyContact) return
    emergencyContact.id = uuid()
    await apiEmergencyContact.insert(emergencyContact as EmergencyContact)
    await fetchEmergencyContacts(userId)
  }

  const deleteEmergencyContactById = async (contactId: string) => {
    if (!apiEmergencyContact) return

    const doc = await apiEmergencyContact.findOne(contactId).exec()
    if (!doc) throw new Error('Emergency Contact not found')
    await doc.remove()
    return true
  }

  const editEmergencyContact = async (contactId: string, data: Partial<EmergencyContact>) => {
    try {
      if (!apiEmergencyContact) {
        return
      }

      const doc = await apiEmergencyContact.findOne(contactId).exec()
      if (!doc) throw new Error('User not found')
      const updatedData = { ...doc.toJSON(), ...data }
      await apiEmergencyContact.upsert(updatedData as any)

      return doc.toJSON()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    createEmergencyContacts,
    fetchEmergencyContacts,
    editEmergencyContact,
    deleteEmergencyContactById,
    emergencyContacts
  }
}

const EmergencyContactsView = () => {
  const { id } = useParams()

  const {
    createEmergencyContacts,
    fetchEmergencyContacts,
    deleteEmergencyContactById,
    editEmergencyContact,
    emergencyContacts
  } = useContactApi()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const editingContactRef = useRef<EmergencyContact | null>(null)
  const deletingContactRef = useRef<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    const init = async () => {
      await fetchEmergencyContacts(id)
    }
    init()
    setLoading(false)
  }, [id])

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const paginated = emergencyContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleGoBack = () => navigate('/members')

  if (loading) {
    return <div>LOADING</div>
  }

  return (
    <Container>
      <Paper sx={{ mt: 4, p: 2, position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '10px'
          }}
        >
          <Button onClick={handleGoBack} variant="outlined" startIcon={<ArrowBackIcon />}>
            Go Back
          </Button>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add Emergency Contact
          </Button>
        </div>

        <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Relationship</TableCell>
                <TableCell>Guardian?</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => console.log('Edit Clicked')} color="primary">
                    <ModeEditIcon />
                  </IconButton>
                  <IconButton onClick={() => console.log('Delete clicked')} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.25
                      }}
                    >
                      {c.isPrimaryContact && <CheckBoxIcon fontSize="small" color="error" />}
                      <Typography variant="body2" component="span">
                        {c.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.relationship}</TableCell>
                  <TableCell>{c.isParentOrGuardian ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{dayjs(c.createdAt).format('MM/DD/YYYY')}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (!id) return
                        editingContactRef.current = c
                        setDialogOpen(true)
                      }}
                      color="primary"
                    >
                      <ModeEditIcon />
                    </IconButton>
                    <IconButton
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (!id) return
                        deletingContactRef.current = c.id
                        setConfirmDeleteOpen(true)
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

        <TablePagination
          component="div"
          count={emergencyContacts.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {id && dialogOpen && (
        <CreateEmergencyContactDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false)
            editingContactRef.current = null
          }}
          contact={editingContactRef.current}
          onSave={async (data) => {
            if (editingContactRef.current) {
              await editEmergencyContact(editingContactRef.current.id, data)
              await fetchEmergencyContacts(id)
              editingContactRef.current = null
            } else {
              await createEmergencyContacts(id, data)
            }
            setDialogOpen(false)
          }}
          userId={id}
        />
      )}
      {id && confirmDeleteOpen && (
        <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <DialogContentText>
              Deleting this emergency contact <strong>CANNOT</strong> be undone. <br /> Proceed with
              caution.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" width={'100%'}>
              <Button
                onClick={() => setConfirmDeleteOpen(false)}
                variant="outlined"
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!deletingContactRef.current) return
                  await deleteEmergencyContactById(deletingContactRef.current)
                  await fetchEmergencyContacts(id)
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
      )}
    </Container>
  )
}

export default EmergencyContactsView
