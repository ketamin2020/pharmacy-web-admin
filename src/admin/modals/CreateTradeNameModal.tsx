import React from 'react'

import { useState } from 'react'

import Button from '@mui/material/Button'
import { styled as styles } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'
import notification from 'common/Notification/Notification'
import IconButton from '@mui/material/IconButton'
import { createTradeName } from 'api/tradeName'

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateTradeNameModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')

  const handleCreate = async () => {
    if (!state) return
    try {
      await createTradeName({ name: state })
      notification('success', 'Trade name was created successfuly!')
      await callback()
      handleClose()
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>Create trade name</DialogContent>

      <DialogContent>
        <TextField
          value={state}
          onChange={e => setState(e.target.value)}
          autoFocus
          margin='dense'
          id='name'
          label='Trade name'
          type='text'
          fullWidth
          variant='standard'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}
