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

import { createPackage } from 'api/package'
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

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreatePackageModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')

  const handleCreate = async () => {
    if (!state) return
    try {
      await createPackage({ name: state })
      await callback()
      handleClose()
      notification('success', 'Package was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
      <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
        Create package
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <TextField
          onChange={e => setState(e.target.value)}
          name='name'
          style={{ marginBottom: '20px', width: '200px' }}
          fullWidth
          placeholder='Type...'
          label='Package'
          required
          value={state}
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
