import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
  Button,
  Typography,
  MenuItem
} from '@mui/material'
import { isAdult } from '@renderer/components/belt/all.belts.component'
import { BeltIcon } from '@renderer/components/belt/belt.component'
import { BeltColor } from '@renderer/db/member.schema'
import { GreenevilleBJJUser } from '@renderer/types/users.types'
import { useEffect, useState } from 'react'

interface PromoteMemberDialogProps {
  open: boolean
  handleClose: () => void
  selectedMember: GreenevilleBJJUser
}

export const PromoteMemberDialog = ({
  open,
  selectedMember,
  handleClose
}: PromoteMemberDialogProps) => {
  const [belt, setBelt] = useState(BeltColor.WHITE)
  const [stripes, setStripes] = useState(0)

  const reset = () => {
    setBelt(BeltColor.WHITE)
    setStripes(0)
  }

  useEffect(() => {
    setBelt(selectedMember?.belt)
    setStripes(selectedMember?.stripes)
  }, [selectedMember])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Promote {selectedMember.firstName}!</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id="belt-rank">Belt</InputLabel>
          <Select
            labelId="belt-rank"
            id="belt-rank"
            value={belt}
            label="Belt"
            onChange={(e) => setBelt(e.target.value)}
          >
            {/* {isAdult(selectedMember.birthday).map((belt) => (
              <MenuItem value={belt}>
                <BeltIcon belt={belt} />
              </MenuItem>
            ))} */}
          </Select>
          {belt !== BeltColor.RED &&
            belt !== BeltColor.RED_WHITE &&
            belt !== BeltColor.RED_BLACK && (
              <>
                <FormLabel id="stripes">Stripes</FormLabel>
                <RadioGroup
                  aria-labelledby="stripes"
                  defaultValue={stripes}
                  name="stripes"
                  row
                  onChange={(e) => setStripes(parseInt(e.target.value))}
                >
                  {Array.from({ length: belt === BeltColor.BLACK ? 7 : 5 }, (_value, index) => (
                    <FormControlLabel key={index} value={index} control={<Radio />} label={index} />
                  ))}
                </RadioGroup>
              </>
            )}
        </FormControl>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {selectedMember && (
            <div>
              <Typography>Current Belt</Typography>
              <BeltIcon belt={selectedMember?.belt} stripes={selectedMember?.stripes} scale={3} />
            </div>
          )}
          <div>
            <Typography>New Belt</Typography>
            <BeltIcon belt={belt} stripes={stripes} scale={3} />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            reset()
            handleClose()
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (belt === selectedMember.belt && stripes === selectedMember.stripes) {
              reset()
              handleClose()
              return
            }
            reset()
            // updateMemberById(selectedMember.id, {
            //   belt: belt as BeltColor,
            //   stripes
            // }).then(() => {
            //   handleClose()
            // })
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
