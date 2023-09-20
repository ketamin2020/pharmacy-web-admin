import React, { useState, useEffect, useRef } from 'react'
import { TextField } from '@mui/material'
import { Edit } from '@material-ui/icons'
import Button from '@mui/material/Button'
import { styled as s } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import { Delete } from '@material-ui/icons'
import { getGroups, deleteGroup, updateGroup, createGroup } from 'api/groups'
import { Add } from '@material-ui/icons'
import styled from '@emotion/styled'
import { uploadSingleFile } from 'api/media'
import Cropper from 'react-cropper'
const BootstrapDialog = s(Dialog)(({ theme }) => ({
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

const initState = {
  group_name: '',
  level: 0,
  group_image: '',
}
const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg'
export const Groups = () => {
  const [open, setOpen] = useState(false)

  const [state, setState] = useState(initState)
  const [groups, setGroups] = useState([])
  const [expanded, setExpanded] = useState<string | false>(false)
  const [expandedFirst, setExpandedFirst] = useState<string | false>(false)
  const [expandedSecond, setExpandedSecond] = useState<string | false>(false)
  const [openCropModal, setOpenCropModal] = useState(false)
  const [image, setImage] = useState(defaultSrc)
  const [imageBlob, setImageBlob] = useState(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [cropData, setCropData] = useState(null)
  const [cropper, setCropper] = useState<Cropper>()
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  const handleChangeFirstLevel = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFirst(isExpanded ? panel : false)
  }
  const handleChangeSecondLevel = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSecond(isExpanded ? panel : false)
  }

  const onChangeFile = (e: any) => {
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

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setState(initState)
  }

  const handleCloseCropModal = () => {
    setOpenCropModal(false)
  }

  const onChange = e => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }

  const fetchGroupList = async () => {
    try {
      const res = await getGroups()
      setGroups(res)
    } catch (error) {
      console.log(error)
    }
  }
  const onCreateGroup = async () => {
    let image = null
    try {
      if (imageBlob) {
        image = await uploadSingleFile(imageBlob)
      }
      await createGroup({ ...state, group_image: image.url })
      await fetchGroupList()
      setImageBlob(null)
      setCropData(null)
    } catch (error) {
      console.log(error)
    }
  }

  const onUpdateGroup = async () => {
    let image = null

    try {
      if (imageBlob) {
        image = await uploadSingleFile(imageBlob)
      }
      await updateGroup({ ...state, group_image: image.url })
      await fetchGroupList()
      setImageBlob(null)
      setCropData(null)
    } catch (error) {
      console.log(error)
    }
  }

  const onDeleteGroup = async (id, level, parent_id) => {
    try {
      await deleteGroup(id, level, parent_id)
      await fetchGroupList()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchGroupList()
  }, [])

  return (
    <div>
      <Button
        variant='outlined'
        onClick={() => {
          setState(prev => ({ ...prev, level: 0 }))
          handleClickOpen()
        }}
      >
        Add group
      </Button>
      {groups?.map((group, i) => (
        <Accordion key={group.id} expanded={expanded === group.id} onChange={handleChange(group.id)}>
          <AccordionSummary
            style={{ alignItems: 'center' }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1bh-content'
            id='panel1bh-header'
          >
            <Typography sx={{ width: '90%', flexShrink: 0 }}>
              <NameWrapper>
                <p>{group.group_name}</p>
                <p>{group?.group_image && <img width={50} src={group?.group_image} alt='' />}</p>
              </NameWrapper>
            </Typography>

            <Typography></Typography>

            <Typography
              onClick={() => {
                setState({ ...group, level: 0 })
                handleClickOpen()
              }}
              sx={{ color: 'text.secondary' }}
            >
              <Edit />
            </Typography>
            <Typography onClick={() => onDeleteGroup(group.id, 0, group.id)} sx={{ color: 'text.secondary' }}>
              <Delete />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Button
              variant='outlined'
              onClick={() => {
                setState(prev => ({ ...prev, level: 1, parent_id: group.id }))
                handleClickOpen()
              }}
            >
              Add first level group
            </Button>
            {group?.children?.map((group, idx) => (
              <Accordion
                key={group.id}
                expanded={expandedFirst === group.id}
                onChange={handleChangeFirstLevel(group.id)}
              >
                <AccordionSummary
                  style={{ justifyContent: 'space-between', alignItems: 'center !important' }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='panel1bh-content'
                  id='panel1bh-header'
                >
                  <NameWrapper>
                    <p>{group.group_name}</p>
                    <p>{group?.group_image && <img width={50} src={group?.group_image} alt='' />}</p>
                  </NameWrapper>

                  <Typography
                    onClick={() => {
                      setState({ ...group, level: 1 })
                      handleClickOpen()
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Edit />
                  </Typography>
                  <Typography
                    onClick={() => onDeleteGroup(group.id, 1, group.parent_id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Delete />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      setState(prev => ({ ...prev, level: 2, parent_id: group.parent_id, child_id: group.id }))
                      handleClickOpen()
                    }}
                  >
                    Add second level group
                  </Button>

                  {group?.children?.map(group => (
                    <Accordion
                      key={group.id}
                      expanded={expandedSecond === group.id}
                      onChange={handleChangeSecondLevel(group.id)}
                    >
                      <AccordionSummary
                        style={{ justifyContent: 'space-between', alignItems: 'center !important' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1bh-content'
                        id='panel1bh-header'
                      >
                        <NameWrapper>
                          <p>{group.group_name}</p>
                          <p>{group?.group_image && <img width={50} src={group?.group_image} alt='' />}</p>
                        </NameWrapper>

                        <Typography
                          onClick={() => onDeleteGroup(group.id, 2, group.parent_id)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <Delete />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>{/* <Typography>{group.group_name}</Typography> */}</AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          Create new groupe
        </BootstrapDialogTitle>
        <DialogContent style={{ width: '400px' }} dividers>
          <TextField
            onChange={onChange}
            name='group_name'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Group name'
            required
            value={state.group_name}
          />
          <TextField onChange={onChangeFile} style={{ marginBottom: '20px' }} fullWidth type='file' />
          {cropData && <img style={{ width: '30%' }} src={cropData} alt='cropped' />}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              state?.id ? onUpdateGroup() : onCreateGroup()
              handleClose()
            }}
          >
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
    </div>
  )
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
const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  & p {
    margin: 0 !important;
  }
`
