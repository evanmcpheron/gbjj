import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Snackbar,
  TextField,
  Typography
} from '@mui/material'
import { QrCheckIn } from './components/qr.reader.component'

import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'
import { formatPhoneNumber } from '@renderer/helpers/strings.helper'
import { useUserApi } from '@renderer/hooks/user.api'
import { useState } from 'react'

type FormValues = {
  phone: string
}

const formSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be 10 digits',
      'string.empty': 'Phone is required'
    })
})

const CheckIn: React.FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const navigate = useNavigate()

  const { fetchUserByPhone } = useUserApi()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: joiResolver(formSchema),
    defaultValues: {
      phone: ''
    }
  })

  const onSubmit = async (data: FormValues) => {
    fetchUserByPhone(data.phone).then((response) => {
      if (!response?.id) {
        setSnackbarOpen(true)
        return
      }
      navigate(`/check-in/${response.id}`)
    })
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Check In
        </Typography>
        <QrCheckIn
          onLookup={(result: string) => {
            navigate(`/check-in/${result}`)
          }}
        />
        <Divider textAlign="center" sx={{ my: 2 }}>
          OR
        </Divider>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone Number"
                type="tel"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={field.value}
                onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                error={!!errors.phone}
                helperText={errors.phone?.message || ' '}
              />
            )}
          />

          <Button type="submit" variant="contained" fullWidth>
            Check In
          </Button>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
            No user found with that phone number.
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  )
}

export default CheckIn
