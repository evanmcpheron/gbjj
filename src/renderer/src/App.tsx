import { useState, useEffect, useCallback } from 'react'
import { Menu } from './views/menu.view'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CheckIn from './views/Checkin/checkin.view'
import NewMembersView from './views/NewMember/new.members.view'
import Members from './views/Members/members.view'
import { CheckInUser } from './views/Checkin/checkin.user.view'
import { DBProvider } from './context/db.context'
import { UserEdit } from './views/UserEdit/user.edit.view'
import { QR } from './views/UserEdit/qr.view'
import { Button } from '@mui/material'

const theme = createTheme({
  colorSchemes: {
    dark: false
  },
  palette: {
    primary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: '#fafafa'
    },
    secondary: {
      light: '#ff4081',
      main: '#f50057',
      dark: '#c51162',
      contrastText: '#fafafa'
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fafafa'
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00',
      contrastText: 'rgba(26,26,26,0.87)'
    },
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#fafafa'
    },
    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c',
      contrastText: 'rgba(26,26,26,0.87)'
    },
    background: {
      default: '#f5f5f5',
      paper: '#fafafa'
    },
    text: {
      primary: 'rgba(26,26,26,0.87)',
      secondary: 'rgba(26,26,26,0.6)',
      disabled: 'rgba(26,26,26,0.38)'
    },
    divider: 'rgba(26,26,26,0.12)'
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    h1: { fontSize: '6rem', fontWeight: 300, lineHeight: 1.167 },
    h2: { fontSize: '3.75rem', fontWeight: 300, lineHeight: 1.2 },
    h3: { fontSize: '3rem', fontWeight: 400, lineHeight: 1.167 },
    h4: { fontSize: '2.125rem', fontWeight: 400, lineHeight: 1.235 },
    h5: { fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.334 },
    h6: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6 },
    subtitle1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.75 },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57
    },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43 },
    button: { textTransform: 'none', fontWeight: 500 },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.66 },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 2.66,
      textTransform: 'uppercase'
    }
  },
  shape: {
    borderRadius: 8
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained'
      },
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 6px rgba(26, 26, 26, 0.1)'
        }
      }
    }
  }
})

const App = () => {
  const [showMenu, setShowMenu] = useState(false)
  const escFunction = useCallback((event) => {
    if (event.key === 'Escape') {
      setShowMenu((prev) => !prev)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [escFunction])

  return (
    <DBProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Button
            onClick={() => setShowMenu((prev) => !prev)}
            sx={{ position: 'fixed', top: 10, right: 10 }}
          >
            MENU
          </Button>
          <Menu showMenu={showMenu} onClose={setShowMenu} />
          <Router>
            <Routes>
              <Route key={1} path={'/'} element={<CheckIn />} />
              <Route key={2} path={'/new-member'} element={<NewMembersView />} />
              <Route key={3} path={'/members'} element={<Members />} />
              <Route key={3} path={'/check-in/:id'} element={<CheckInUser />} />
              <Route key={3} path={'/user/:id'} element={<UserEdit />} />
              <Route key={3} path={'/qr/:id'} element={<QR />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </DBProvider>
  )
}

export default App
