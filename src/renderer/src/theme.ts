import { styled } from '@mui/material/styles'
import {
  Box,
  Grid,
  Container,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Button,
  TextField,
  Select,
  Dialog,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Radio,
  Switch,
  Slider,
  Avatar,
  Badge,
  Chip,
  Divider,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material'
import type { Theme } from '@mui/material/styles'

// Layout & Containers
export const HeaderBar = styled(Box)<{ theme: Theme }>`
  display: flex;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing(2)};
  margin: ${({ theme }) => theme.spacing(2)};
`

export const FlexContainer = styled(Box)<{ theme: Theme }>`
  display: flex;
  flex-wrap: wrap;
  margin: ${({ theme }) => theme.spacing(2)};
`

export const GridContainer = styled(Grid)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing(2)};
`

export const GridItem = styled(Grid)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing(1)};
`

export const AppContainer = styled(Container)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing(3)};
`

// Paper & Cards
export const CardPaper = styled(Paper)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing(3)};
  margin: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.background.paper};
`

export const StyledCard = styled(Card)<{ theme: Theme }>`
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  padding: ${({ theme }) => theme.spacing(2)};
`

export const CardTitle = styled(CardHeader)<{ theme: Theme }>`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

export const CardContentWrapper = styled(CardContent)<{ theme: Theme }>`
  padding-top: 0;
`

// Buttons
export const PrimaryButton = styled(Button)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: ${({ theme }) => theme.spacing(1, 3)};
  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.dark};
  }
`

export const SecondaryButton = styled(Button)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => theme.palette.secondary.contrastText};
  padding: ${({ theme }) => theme.spacing(1, 3)};
  &:hover {
    background-color: ${({ theme }) => theme.palette.secondary.dark};
  }
`

export const StyledIconButton = styled(IconButton)<{ theme: Theme }>`
  color: ${({ theme }) => theme.palette.primary.main};
`

// Inputs & Form Controls
export const FilledInputField = styled(TextField)<{ theme: Theme }>`
  margin: ${({ theme }) => theme.spacing(1, 0)};
  width: 100%;
  & .MuiFilledInput-root {
    background-color: ${({ theme }) => theme.palette.grey[100]};
  }
`

export const OutlinedInputField = styled(TextField)<{ theme: Theme }>`
  margin: ${({ theme }) => theme.spacing(1, 0)};
  width: 100%;
`

export const StyledSelect = styled(Select)<{ theme: Theme }>`
  margin: ${({ theme }) => theme.spacing(1, 0)};
  min-width: 120px;
`

export const StyledCheckbox = styled(Checkbox)<{ theme: Theme }>`
  color: ${({ theme }) => theme.palette.primary.main};
`

export const StyledRadio = styled(Radio)<{ theme: Theme }>`
  color: ${({ theme }) => theme.palette.secondary.main};
`

export const StyledSwitch = styled(Switch)<{ theme: Theme }>`
  & .MuiSwitch-switchBase.Mui-checked {
    color: ${({ theme }) => theme.palette.primary.main};
  }
  & .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    background-color: ${({ theme }) => theme.palette.primary.light};
  }
`

export const StyledSlider = styled(Slider)<{ theme: Theme }>`
  margin: ${({ theme }) => theme.spacing(2, 0)};
`

// Dialogs & Overlays
export const StyledDialog = styled(Dialog)<{ theme: Theme }>`
  & .MuiDialog-paper {
    padding: ${({ theme }) => theme.spacing(3)};
    min-width: 320px;
  }
`

export const StyledSnackbar = styled(Snackbar)<{ theme: Theme }>`
  & .MuiSnackbarContent-root {
    background-color: ${({ theme }) => theme.palette.grey[900]};
  }
`

export const StyledAlert = styled(Alert)<{ theme: Theme }>`
  margin: ${({ theme }) => theme.spacing(2, 0)};
`

// Tables & Lists
export const StyledTable = styled(Table)<{ theme: Theme }>`
  min-width: 650px;
`

export const HoverTableRow = styled(TableRow)<{ theme: Theme }>`
  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`

export const PaddedTableCell = styled(TableCell)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing(1, 2)};
`

export const HeadingTableCell = styled(TableCell)<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing(1, 2)};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
`

// Table Head & Body
export const StyledTableHead = styled(TableHead)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.palette.grey[100]};
`

export const StyledTableBody = styled(TableBody)<{ theme: Theme }>`
  & > .MuiTableRow-root:nth-of-type(odd) {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`

// AppBar & Toolbar
export const StyledAppBar = styled(AppBar)<{ theme: Theme }>`
  box-shadow: none;
  background-color: ${({ theme }) => theme.palette.primary.main};
`

export const StyledToolbar = styled(Toolbar)<{ theme: Theme }>`
  min-height: ${({ theme }) => theme.mixins.toolbar.minHeight}px;
  padding: ${({ theme }) => theme.spacing(0, 2)};
`

// Drawer
export const StyledDrawer = styled(Drawer)<{ theme: Theme }>`
  & .MuiDrawer-paper {
    width: 240px;
    background-color: ${({ theme }) => theme.palette.background.paper};
  }
`

// Chips
export const PrimaryChip = styled(Chip)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.palette.primary.light};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  margin: ${({ theme }) => theme.spacing(0.5)};
`

export const SecondaryChip = styled(Chip)<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.palette.secondary.light};
  color: ${({ theme }) => theme.palette.secondary.contrastText};
  margin: ${({ theme }) => theme.spacing(0.5)};
`

// Navigation List
export const NavList = styled(List)<{ theme: Theme }>`
  padding: 0;
`

export const NavListItem = styled(ListItem)<{ theme: Theme }>`
  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`

export const NavListItemText = styled(ListItemText)<{ theme: Theme }>`
  padding-left: ${({ theme }) => theme.spacing(1)};
`

// Media & Icons
export const UserAvatar = styled(Avatar)<{ theme: Theme }>`
  width: ${({ theme }) => theme.spacing(4)};
  height: ${({ theme }) => theme.spacing(4)};
`

export const NotificationBadge = styled(Badge)<{ theme: Theme }>`
  & .MuiBadge-badge {
    background-color: ${({ theme }) => theme.palette.error.main};
    color: ${({ theme }) => theme.palette.error.contrastText};
  }
`

// Miscellaneous
export const StyledDivider = styled(Divider)<{ theme: Theme }>`
  margin: ${({ theme }) => theme.spacing(2, 0)};
`

export const FooterBar = styled(Box)<{ theme: Theme }>`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.grey[200]};
`

export const StyledTabs = styled(Tabs)<{ theme: Theme }>`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

export const StyledTab = styled(Tab)<{ theme: Theme }>`
  text-transform: none;
`

export const StyledTooltip = styled(Tooltip)<{ theme: Theme }>`
  & .MuiTooltip-tooltip {
    background-color: ${({ theme }) => theme.palette.grey[700]};
  }
`
