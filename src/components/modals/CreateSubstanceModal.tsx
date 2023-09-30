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
import { createSubstance } from 'api/substances'
const BootstrapDialog = styles(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}
const initData = {
  name_ua: '',
  name_eu: '',
}
interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateSubstanceModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState({ initData })
  const onChangeHandle = (e: onChange<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }
  const handleCreate = async () => {
    try {
      await createSubstance(state)
      await callback()
      handleClose()
      notification('success', 'Substance was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
      <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
        Create new substance
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <TextField
          onChange={onChangeHandle}
          name='name_ua'
          style={{ marginBottom: '20px' }}
          fullWidth
          placeholder='Type...'
          label='Name UA'
          required
          value={state.name_ua}
        />

        <TextField
          onChange={onChangeHandle}
          name='name_eu'
          style={{ marginBottom: '20px' }}
          fullWidth
          placeholder='Type...'
          label='Name EU'
          required
          value={state.name_eu}
        />
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={handleCreate}>
          Save changes
        </Button>
      </DialogActions>
    </BootstrapDialog>
  )
}
