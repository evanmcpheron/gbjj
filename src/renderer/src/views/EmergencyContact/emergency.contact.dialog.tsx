// CreateEmergencyContactDialog.tsx
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box
} from '@mui/material'
import { EmergencyContact } from '@renderer/types/users.types'
import { formatPhoneNumber } from '@renderer/helpers/strings.helper'

interface Props {
  open: boolean
  userId: string
  contact?: EmergencyContact | null
  onClose: () => void
  onSave: (data: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

export function CreateEmergencyContactDialog({ open, userId, contact, onClose, onSave }: Props) {
  const [name, setName] = useState(contact?.name || '')
  const [email, setEmail] = useState(contact?.email || '')
  const [phone, setPhone] = useState(contact?.phone || '')
  const [relationship, setRelationship] = useState(contact?.relationship || '')
  const [isParentOrGuardian, setIsParentOrGuardian] = useState(contact?.isParentOrGuardian || false)
  const [isPrimaryContact, setIsPrimaryContact] = useState(contact?.isPrimaryContact || false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await onSave({
        name,
        email,
        phone,
        relationship,
        userId,
        isParentOrGuardian,
        isPrimaryContact
      })
      onClose()

      setName('')
      setEmail('')
      setPhone('')
      setRelationship('')
      setIsParentOrGuardian(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Emergency Contact</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            required
            fullWidth
          />
          <TextField
            label="Relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            required
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={isParentOrGuardian}
                onChange={(e) => setIsParentOrGuardian(e.target.checked)}
              />
            }
            label="Is Parent / Guardian"
          />
          <FormControlLabel
            control={
              <Switch
                checked={isPrimaryContact}
                onChange={(e) => setIsPrimaryContact(e.target.checked)}
              />
            }
            label="Primary Contact"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ width: '100%', justifyContent: 'space-between' }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
