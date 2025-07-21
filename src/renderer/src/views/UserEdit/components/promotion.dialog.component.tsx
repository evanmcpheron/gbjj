import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack
} from '@mui/material'
import dayjs from 'dayjs'
import { BeltColor, GreenevilleBJJUser } from '@renderer/types/users.types'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { adultOrChildBelt } from '@renderer/components/belt/all.belts.component'
import { usePromotionApi } from '@renderer/hooks/user.api'
import { DateTimePicker } from '@mui/x-date-pickers'

interface RankDialogProps {
  open: boolean
  user: GreenevilleBJJUser
  onClose: () => void
  onSave: () => void
}

export const RankDialog = ({ open, user, onClose, onSave }: RankDialogProps) => {
  const { createPromotion } = usePromotionApi()
  const [stripes, setStripes] = useState(user.rank.stripes || 0)
  const [belt, setBelt] = useState(user.rank.belt || BeltColor.WHITE)
  const [promotionDate, setPromotionDate] = useState<Date>(new Date())

  const handlePromotion = async () => {
    await createPromotion({
      userId: user.id,
      belt,
      stripes,
      promotedAt: promotionDate?.toISOString() || new Date().toISOString()
    })
    onSave()
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Promotion</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Rank Info
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Promotion Date</FormLabel>
          <DateTimePicker
            sx={{ mb: 2 }}
            value={dayjs(promotionDate)}
            onChange={(value) => setPromotionDate(dayjs(value).toDate())}
          />

          <FormLabel>Belt</FormLabel>
          <Select value={belt} onChange={(e) => setBelt(e.target.value)}>
            {adultOrChildBelt(dayjs(user?.birthday).toDate()).map((belt, index) => (
              <MenuItem key={index} value={belt}>
                <BeltIcon belt={belt} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormLabel>Stripes</FormLabel>
        <RadioGroup row value={stripes} onChange={(e) => setStripes(Number(e.target.value))}>
          {Array.from({ length: belt === BeltColor.BLACK ? 7 : 5 }).map((_, i) => (
            <FormControlLabel key={i} value={i} control={<Radio />} label={i} />
          ))}
        </RadioGroup>

        <Stack direction="column" spacing={2} alignItems="center">
          {user && (
            <div style={{ textAlign: 'center' }}>
              <Typography>Current Belt</Typography>
              <BeltIcon belt={user.rank.belt} stripes={user.rank.stripes} scale={3} />
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <Typography>New Belt</Typography>
            <BeltIcon belt={belt} stripes={stripes} scale={3} />
          </div>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handlePromotion} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
