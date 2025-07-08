import React from 'react'
import { Box, Paper, Stack, Button, Typography } from '@mui/material'

interface MenuProps {
  showMenu: boolean
  onClose?: (value: boolean) => void
}

export const Menu: React.FC<MenuProps> = ({ showMenu, onClose }) => {
  if (!showMenu) return null

  return (
    <Box
      onClick={() => onClose?.(false)}
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        onClick={(e) => e.stopPropagation()}
        elevation={12}
        sx={{
          width: 320,
          p: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Menu
        </Typography>

        <Stack spacing={2} mt={1}>
          <Button variant="contained" fullWidth href="/">
            Check In
          </Button>
          <Button variant="contained" fullWidth href="/new-member">
            New Member
          </Button>
          <Button variant="contained" fullWidth href="/members">
            Members
          </Button>
        </Stack>

        {onClose && (
          <Button
            variant="outlined"
            onClick={() => onClose(false)}
            fullWidth
            sx={{ mt: 3 }}
            size="small"
          >
            Close
          </Button>
        )}
      </Paper>
    </Box>
  )
}
