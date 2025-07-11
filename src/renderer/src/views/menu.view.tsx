import React from 'react'
import { Box, Paper, Stack, Button, Typography, Divider } from '@mui/material'

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
        variant="outlined"
        sx={{
          width: 320,
          p: 3,
          borderRadius: 1,
          textAlign: 'center'
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" align="center">
            Menu
          </Typography>
          <Divider />
          <Stack spacing={2}>
            <Button variant="contained" fullWidth href="/">
              Check In
            </Button>
            <Button variant="contained" fullWidth href="/new-member">
              New Member
            </Button>
            <Button variant="contained" fullWidth href="/members">
              Members
            </Button>
            <Button variant="contained" fullWidth href="/backup">
              Backup
            </Button>
          </Stack>
          {onClose && (
            <Button variant="outlined" fullWidth size="small" onClick={() => onClose(false)}>
              Close
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}
