import { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Theme
} from '@mui/material'
import styled from '@emotion/styled'
import { EmergencyContact } from '@renderer/types/users.types'
import { formatPhoneNumber } from '@renderer/helpers/strings.helper'
import { joiResolver } from '@hookform/resolvers/joi'
import { Controller, useForm } from 'react-hook-form'
import { formSchema } from './emergency.contact.logic'

interface Props {
  open: boolean
  userId: string
  contact?: EmergencyContact | null
  onClose: () => void
  onSave: (data: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

type FormValues = {
  name: string
  email: string
  phone: string
  relationship: string
  isParentOrGuardian: boolean
  isPrimaryContact: boolean
}

// Styled Components
const StyledDialogTitle = styled(DialogTitle)<{ theme?: Theme }>`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  text-align: center;
  padding: ${({ theme }) => theme.spacing(3)};
`

const StyledDialogContent = styled(DialogContent)<{ theme?: Theme }>`
  padding: ${({ theme }) => theme.spacing(4)};
`

const FieldGrid = styled(Box)<{ theme?: Theme }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(2)};
  & .fullWidth {
    grid-column: span 2;
  }
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const StyledDialogActions = styled(DialogActions)<{ theme?: Theme }>`
  padding: ${({ theme }) => theme.spacing(3)};
  justify-content: space-between;
`

export function CreateEmergencyContactDialog({ open, userId, contact, onClose, onSave }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: joiResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      relationship: '',
      isParentOrGuardian: false,
      isPrimaryContact: false
    }
  })

  useEffect(() => {
    if (contact) {
      reset({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        relationship: contact.relationship,
        isParentOrGuardian: contact.isParentOrGuardian,
        isPrimaryContact: contact.isPrimaryContact
      })
    }
  }, [contact, reset])

  const onSubmit = async (data: FormValues) => {
    try {
      await onSave({
        name: data.name,
        email: data.email,
        phone: data.phone,
        relationship: data.relationship,
        userId,
        isParentOrGuardian: data.isParentOrGuardian,
        isPrimaryContact: data.isPrimaryContact
      })
      onClose()
      reset({
        name: '',
        email: '',
        phone: '',
        relationship: '',
        isParentOrGuardian: false,
        isPrimaryContact: false
      })
    } catch (error) {
      console.error('Error saving emergency contact:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <StyledDialogTitle>
          {contact ? 'Edit Emergency Contact' : 'New Emergency Contact'}
        </StyledDialogTitle>
        <StyledDialogContent>
          <FieldGrid>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="fullWidth"
                  label="Name"
                  variant="outlined"
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message || ' '}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="fullWidth"
                  label="Email"
                  type="email"
                  variant="outlined"
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message || ' '}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="fullWidth"
                  label="Phone Number"
                  type="tel"
                  variant="outlined"
                  required
                  value={field.value}
                  onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                  error={!!errors.phone}
                  helperText={errors.phone?.message || ' '}
                />
              )}
            />
            <Controller
              name="relationship"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="fullWidth"
                  label="Relationship"
                  variant="outlined"
                  required
                  error={!!errors.relationship}
                  helperText={errors.relationship?.message || ' '}
                />
              )}
            />
            <Controller
              name="isParentOrGuardian"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  className="fullWidth"
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Is Parent / Guardian"
                />
              )}
            />
            <Controller
              name="isPrimaryContact"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  className="fullWidth"
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Primary Contact?"
                />
              )}
            />
          </FieldGrid>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={onClose} variant="outlined" fullWidth>
            Cancel
          </Button>
          <Button type="submit" variant="contained" fullWidth>
            Save
          </Button>
        </StyledDialogActions>
      </form>
    </Dialog>
  )
}
