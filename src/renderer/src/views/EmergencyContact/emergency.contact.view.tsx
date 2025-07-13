import React, { useState, useEffect, useRef } from 'react'
import {
  Container,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
  Theme
} from '@mui/material'
import styled from '@emotion/styled'
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
import { theme } from '@renderer/App'
import { StyledPagination } from '../Members/members.view'

// Styled Components
const StyledContainer = styled(Container)<{ theme: Theme }>`
  padding-top: ${({ theme }) => theme.spacing(4)};
`

const StyledPaper = styled(Paper)<{ theme: Theme }>`
  position: relative;
  background: ${({ theme }) => theme.palette.background.paper};
`

export const HeaderBar = styled(Box)<{ theme: Theme }>`
  display: flex;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing(2)};
  margin: ${({ theme }) => theme.spacing(2)};
`

const StyledTableContainer = styled(TableContainer)`
  max-height: 300px;
  overflow: auto;
`

const ConfirmDialogContent = styled(DialogContent)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing(4)};
`

const ConfirmDialogActions = styled(DialogActions)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing(2)};
`

const ConfirmActionsBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

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
      setEmergencyContacts(docs || [])
      return docs || []
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
      if (!apiEmergencyContact) return
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
    ;(async () => {
      await fetchEmergencyContacts(id)
      setLoading(false)
    })()
  }, [id])

  const handleChangePage = (_: any, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const paginated = emergencyContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (loading) return <Typography>Loading...</Typography>

  return (
    <StyledContainer theme={theme}>
      <StyledPaper theme={theme}>
        <HeaderBar theme={theme}>
          <Button
            onClick={() => navigate('/members')}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add Emergency Contact
          </Button>
        </HeaderBar>

        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Relationship</TableCell>
                <TableCell>Guardian?</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      {c.isPrimaryContact && <CheckBoxIcon fontSize="small" color="error" />}
                      <Typography variant="body2">{c.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.relationship}</TableCell>
                  <TableCell>{c.isParentOrGuardian ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{dayjs(c.createdAt).format('MM/DD/YYYY')}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => {
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
                      onClick={(e) => {
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
        </StyledTableContainer>

        <StyledPagination
          theme={theme}
          count={emergencyContacts.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </StyledPaper>

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

      {id && (
        <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
          <DialogTitle>Delete Emergency Contact</DialogTitle>
          <ConfirmDialogContent theme={theme}>
            <DialogContentText>
              Deleting this emergency contact <strong>cannot</strong> be undone. Proceed with
              caution.
            </DialogContentText>
          </ConfirmDialogContent>
          <ConfirmDialogActions theme={theme}>
            <ConfirmActionsBox>
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
            </ConfirmActionsBox>
          </ConfirmDialogActions>
        </Dialog>
      )}
    </StyledContainer>
  )
}

export default EmergencyContactsView
