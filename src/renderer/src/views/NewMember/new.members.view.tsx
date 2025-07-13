// NewMembersView.tsx
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useForm, Controller } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import dayjs from 'dayjs'

import { adultOrChildBelt } from '@renderer/components/belt/all.belts.component'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { BeltColor } from '@renderer/db/member.schema'
import { formatPhoneNumber } from '@renderer/helpers/strings.helper'
import { usePromotionApi, useUserApi } from '@renderer/hooks/user.api'
import { useNavigate } from 'react-router-dom'
import { formSchema } from './new.members.logic'

type FormValues = {
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  email: string
  phone: string
  birthday: Date
  hasSignedWaiver: boolean
  belt: BeltColor
  stripes: number
}

const NewMembersView: React.FC = () => {
  const navigate = useNavigate()
  const { createUser } = useUserApi()
  const { createPromotion } = usePromotionApi()

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    watch
  } = useForm<FormValues>({
    resolver: joiResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'male',
      email: '',
      phone: '',
      birthday: new Date(),
      hasSignedWaiver: false,
      belt: BeltColor.WHITE,
      stripes: 0
    }
  })

  const watchedBelt = watch('belt')
  const watchedStripes = watch('stripes')
  const watchedBirthday = watch('birthday')

  const onSubmit = async (data: FormValues) => {
    const createdUser = await createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      birthday: data.birthday.toISOString(),
      hasSignedWaiver: data.hasSignedWaiver
    })

    await createPromotion({
      userId: createdUser.id,
      belt: data.belt,
      stripes: data.stripes
    })

    navigate('/members')
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Member
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" gap={3}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message || ' '}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message || ' '}
                />
              )}
            />
          </Box>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset" error={!!errors.gender} sx={{ my: 2 }}>
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup row {...field}>
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
                <FormHelperText>{errors.gender?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
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
          <Controller
            name="birthday"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Birthday"
                  value={dayjs(field.value)}
                  onChange={(d) => {
                    if (d?.isValid()) {
                      field.onChange(d.toDate())
                    }
                  }}
                  slotProps={{
                    textField: {
                      margin: 'normal',
                      required: true,
                      fullWidth: true,
                      error: !!errors.birthday,
                      helperText: errors.birthday?.message || ' '
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          />

          <Controller
            name="hasSignedWaiver"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                sx={{ my: 2 }}
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Signed Waiver"
              />
            )}
          />

          <Typography sx={{ mt: 3 }}>Rank</Typography>

          <Controller
            name="belt"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.belt} sx={{ mt: 1 }}>
                <InputLabel id="belt-rank">Belt</InputLabel>
                <Select
                  {...field}
                  labelId="belt-rank"
                  label="Belt"
                  onChange={(e) => field.onChange(e.target.value as BeltColor)}
                >
                  {adultOrChildBelt(watchedBirthday).map((belt, i) => (
                    <MenuItem key={i} value={belt}>
                      <BeltIcon belt={belt} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.belt?.message}</FormHelperText>
              </FormControl>
            )}
          />
          <Box display="flex" flexDirection="column" mb={3}>
            <Controller
              name="stripes"
              control={control}
              render={({ field }) => (
                <FormControl component="fieldset" error={!!errors.stripes} sx={{ mt: 2 }}>
                  <FormLabel component="legend">Stripes</FormLabel>
                  <RadioGroup
                    row
                    value={String(field.value)}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  >
                    {Array.from(
                      {
                        length: getValues('belt') === BeltColor.BLACK ? 7 : 5
                      },
                      (_v, idx) => (
                        <FormControlLabel
                          key={idx}
                          value={String(idx)}
                          control={<Radio />}
                          label={idx.toString()}
                        />
                      )
                    )}
                  </RadioGroup>
                  <FormHelperText>{errors.stripes?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <BeltIcon belt={watchedBelt} stripes={watchedStripes} scale={5} />
          </Box>

          <Button type="submit" variant="contained" fullWidth>
            Create Member
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default NewMembersView
