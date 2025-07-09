import { Container, Paper, Typography } from '@mui/material'
import { QrCheckIn } from './components/qr.reader.component'
import { useNavigate } from 'react-router-dom'

const CheckIn: React.FC = () => {
  const navigate = useNavigate()

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
      </Paper>
    </Container>
  )
}

export default CheckIn
