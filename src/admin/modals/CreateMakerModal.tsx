import * as React from 'react'
import { useRef, useState } from 'react'

import Box from '@mui/material/Box'

import IconButton from '@mui/material/IconButton'

import Button from '@mui/material/Button'
import { styled as styles } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'
import { uploadSingleFile } from 'api/media'

import Cropper from 'react-cropper'
import { createMaker } from 'api/makers'

import notification from 'common/Notification/Notification'

const BootstrapDialog = styles(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

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

const initData = {
  full_name: '',
  short_name: '',
  country: '',
  factory: '',
}

export const CreateMakerModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState(initData)
  const [openCropModal, setOpenCropModal] = useState(false)
  const [image, setImage] = useState(null)
  const [cropData, setCropData] = useState(null)
  const [cropper, setCropper] = useState<Cropper>()
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageBlob, setImageBlob] = useState(null)

  const onChangeHandle = (e: onChange<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }
  const onChange = (e: any) => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const reader = new FileReader()
    reader.onload = () => {
      setOpenCropModal(true)
      setImage(reader.result as any)
    }
    reader.readAsDataURL(files[0])
  }

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      const canvas = cropper.getCroppedCanvas()
      const base64 = canvas.toDataURL()
      canvas.toBlob(async blob => {
        const fd = new FormData()
        const file = new File([blob], 'filename.jpeg')
        fd.append('image', file)
        setImageBlob(fd)
      })

      setCropData(base64)
    }
  }

  const handleCloseCropModal = () => {
    setOpenCropModal(false)
  }

  const handleCreate = async () => {
    try {
      const logo = await uploadSingleFile(imageBlob)
      await createMaker({
        ...state,
        logo: {
          ...logo,
        },
      })
      await callback()
      handleClose()
      notification('success', 'Maker was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          Create new maker
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TextField
            onChange={onChangeHandle}
            name='full_name'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Full name'
            required
            value={state.full_name}
          />

          <TextField
            onChange={onChangeHandle}
            name='short_name'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Short name'
            required
            value={state.short_name}
          />

          <TextField
            onChange={onChangeHandle}
            name='country'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Country'
            required
            value={state.country}
          />

          <TextField
            onChange={onChangeHandle}
            name='factory'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Factory'
            value={state.factory}
            required
          />
          <TextField onChange={onChange} style={{ marginBottom: '20px' }} fullWidth type='file' />
          {cropData && <img style={{ width: '30%' }} src={cropData} alt='cropped' />}
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleCreate}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog onClose={handleCloseCropModal} aria-labelledby='customized-dialog-title' open={openCropModal}>
        <DialogContent dividers>
          <Cropper
            style={{ height: 400, width: '100%' }}
            initialAspectRatio={1}
            preview='.img-preview'
            src={image}
            ref={imageRef}
            viewMode={1}
            guides={true}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            checkOrientation={false}
            onInitialized={instance => {
              setCropper(instance)
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              getCropData()
              setOpenCropModal(false)
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  )
}
