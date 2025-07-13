import { useNavigate, useParams } from 'react-router-dom'
import { Button, Container, Paper, Typography, Box } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { QRCodeSVG } from 'qrcode.react'

export const QR = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const handleGoBack = () => navigate(`/user/${id}`)
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, position: 'relative' }}>
        <Button
          onClick={handleGoBack}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ position: 'absolute', top: 16, left: 16 }}
        >
          Go Back
        </Button>

        <Typography variant="h4" align="center" gutterBottom>
          Check in QR Code
        </Typography>
        <Box
          sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', mt: 3 }}
        >
          <QRCodeSVG size={400} value={id || ''} />
        </Box>
      </Paper>
    </Container>
  )
}
