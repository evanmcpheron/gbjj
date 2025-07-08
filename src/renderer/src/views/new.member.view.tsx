// import {
//   Box,
//   Button,
//   Container,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Radio,
//   RadioGroup,
//   Select,
//   SelectChangeEvent,
//   TextField,
//   Typography
// } from '@mui/material'
// import { DatePicker } from '@mui/x-date-pickers'
// import { isAdult } from '@renderer/components/belt/all.belts.component'
// import { BeltIcon } from '@renderer/components/belt/belt.component'
// import { BeltColor } from '@renderer/db/member.schema'
// import { GreenevilleBJJObject } from '@renderer/types/base.types'
// import dayjs from 'dayjs'
// import { Timestamp } from 'firebase/firestore'
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// const NewMembersView: React.FC = () => {
//   const [formData, setFormData] = useState({
//     belt: BeltColor.WHITE,
//     stripes: 0,
//     firstName: '',
//     lastName: '',
//     birthday: Timestamp.now(),
//     email: '',
//     phone: ''
//   })

//   const navigate = useNavigate()

//   const handleSubmit = async (e: GreenevilleBJJObject) => {
//     e.preventDefault()

//     await postDoc('members', {
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       email: formData.email,
//       phone: formData.phone,
//       birthday: formData.birthday,
//       belt: formData.belt,
//       stripes: formData.stripes,
//       checkins: []
//     })

//     navigate('/members')
//   }

//   const handleChange = (event: SelectChangeEvent) => {
//     setFormData((prev) => ({
//       ...prev,
//       rank: {
//         belt: event.target.value as BeltColor,
//         stripes: prev.stripes
//       }
//     }))
//   }

//   const handleUpdateBelt = (event: SelectChangeEvent) => {
//     setFormData((prev) => ({
//       ...prev,
//       rank: {
//         belt: prev.belt,
//         stripes: parseInt(event.target.value)
//       }
//     }))
//   }

//   return (
//     <Container>
//       <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
//         <Typography variant="h5" component="h1" gutterBottom>
//           Create New Member
//         </Typography>
//         <Box component="form" onSubmit={handleSubmit} noValidate>
//           <TextField
//             label="First Name"
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             value={formData.firstName}
//             onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
//           />
//           <TextField
//             label="Last Name"
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             value={formData.lastName}
//             onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
//           />
//           <RadioGroup defaultValue={'MALE'}>
//             <FormControlLabel value={'MALE'} control={<Radio />} label={'Male'} />
//             <FormControlLabel value={'FEMALE'} control={<Radio />} label={'Female'} />
//           </RadioGroup>
//           <TextField
//             label="Email"
//             type="email"
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             value={formData.email}
//             onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
//           />
//           <TextField
//             label="Phone Number"
//             type="tel"
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             value={formData.phone}
//             onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
//           />
//           <DatePicker
//             sx={{ width: '100%' }}
//             defaultValue={dayjs(formData.birthday.toDate())}
//             onChange={(value) => {
//               setFormData((prev) => ({
//                 ...prev,
//                 birthday: Timestamp.fromDate(value?.toDate() || new Date())
//               }))
//             }}
//           />
//         </Box>
//         <Typography>Rank</Typography>
//         <FormControl fullWidth>
//           <InputLabel id="belt-rank">Belt</InputLabel>
//           <Select
//             labelId="belt-rank"
//             id="belt-rank"
//             value={formData.belt}
//             label="Belt"
//             onChange={handleChange}
//           >
//             {isAdult(formData.birthday).map((belt) => (
//               <MenuItem value={belt}>
//                 <BeltIcon belt={belt} />
//               </MenuItem>
//             ))}
//           </Select>
//           {formData.belt !== BeltColor.RED &&
//             formData.belt !== BeltColor.RED_WHITE &&
//             formData.belt !== BeltColor.RED_BLACK && (
//               <>
//                 <FormLabel id="stripes">Stripes</FormLabel>
//                 <RadioGroup
//                   aria-labelledby="stripes"
//                   defaultValue={0}
//                   name="stripes"
//                   row
//                   onChange={handleUpdateBelt}
//                 >
//                   {Array.from(
//                     { length: formData.belt === BeltColor.BLACK ? 7 : 5 },
//                     (_value, index) => (
//                       <FormControlLabel value={index} control={<Radio />} label={index} />
//                     )
//                   )}
//                 </RadioGroup>
//               </>
//             )}
//         </FormControl>
//         <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
//           <BeltIcon belt={formData.belt} stripes={formData.stripes} scale={5} />
//         </div>
//         <Button type="submit" onClick={handleSubmit} variant="contained" fullWidth sx={{ mt: 2 }}>
//           Create Member
//         </Button>
//       </Paper>
//     </Container>
//   )
// }

// export default NewMembersView
