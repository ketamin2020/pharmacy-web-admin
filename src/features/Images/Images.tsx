import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import { styled as Style } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { TextField } from '@mui/material'
import Cropper from 'react-cropper'

import { createImages, getImages, deleteImages, updateImages } from 'api/images'
import { uploadSingleFile } from 'api/media'
import notification from 'common/Notification/Notification'
import moment from 'moment'
import styled from '@emotion/styled'
import defaultImg from './defaut.png'

import { Tooltip, Image } from 'antd'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

const BootstrapDialog = Style(Dialog)(({ theme }) => ({
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

const UploadRow = styled.div`
  width: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;

  & .custom-file-input::-webkit-file-upload-button {
    visibility: hidden;
  }
  & .custom-file-input::before {
    content: 'Upload';
    display: inline-block;
    background: linear-gradient(top, #f9f9f9, #e3e3e3);
    border: 1px solid #999;
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
  }
  & .custom-file-input:hover::before {
    border-color: black;
  }
  & .custom-file-input:active::before {
    background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
  }
  & img {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: contain;
    object-position: center;
    border: 1px solid #71b9ea;
  }
  & input {
    margin-left: 15px;
  }
`

const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg'

const initData = {
  morion: '',
  items: [
    { id: 0, url: defaultImg },
    { id: 0, url: defaultImg },
    { id: 0, url: defaultImg },
    { id: 0, url: defaultImg },
  ],
}

export const Images = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [rowSelected, setRowSelected] = useState({})
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [open, setOpen] = React.useState(false)
  const [openCropModal, setOpenCropModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [index, setIndex] = useState(null)
  const [image, setImage] = useState(defaultSrc)
  const [cropData, setCropData] = useState(null)
  const [cropper, setCropper] = useState<Cropper>()
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageBlob, setImageBlob] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [checkedRows, setCheckedRows] = useState([])
  const onChange = (e: any, index) => {
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
      setIndex(index)
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
        const res = await uploadSingleFile(fd)

        setState(prev => ({
          ...prev,
          items: prev.items.map((item, i) => (i === index ? { id: res.id, url: res.url } : item)),
        }))
      })
      setIndex(null)

      setCropData(base64)
    }
  }

  const onChangeHandle = (e: onChange<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setState(initData)
    setSelected([])
  }
  const handleCloseCropModal = () => {
    setOpenCropModal(false)
  }

  const fetchImages = async params => {
    try {
      const { data, meta } = await getImages(params)
      setPagination({
        page: meta.current,
        page_size: meta.pageSize,
        total: meta.total,
      })
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreateImages = async () => {
    try {
      const data = { ...state, items: state.items.map(item => (item.id ? item : { id: 0, url: '' })) }
      await createImages(data)

      await fetchImages({ page: pagination.page, per_page: pagination.per_page })
      handleClose()
      notification('success', 'Images created successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  const handleUpdateImages = async () => {
    try {
      const data = { ...state, items: state.items.map(item => (item.id ? item : { id: 0, url: '' })) }
      await updateImages(data)

      await fetchImages({ page: pagination.page, per_page: pagination.per_page })
      handleClose()
      notification('success', 'Images updated successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  const handleDeleteImage = async (itemId, imageId) => {
    try {
      await deleteImages(itemId, imageId)
      await fetchImages({ page: pagination.page, per_page: pagination.per_page })
      handleClose()
      notification('success', 'Images deleted successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  useEffect(() => {
    fetchImages({ page: pagination.page, per_page: pagination.per_page })
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchImages({
      page: pagination.current,
      sort_field: sorter.order ? sorter.field : null,
      order: sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null,
      per_page: pagination.pageSize,
      ...filters,
    })
  }

  const onRow = (record: any, rowIndex: number) => ({
    onClick: () => {
      setClickedRowIndex(rowIndex)
    },
  })

  const rowSelection = {
    selectedRowKeys,
    columnWidth: 30,
    onChange: (
      selectedRowKeys: React.SetStateAction<never[]>,
      selectedRows: {
        map: (arg0: (row: any) => any) => React.SetStateAction<never[]>
      },
    ) => {
      setCheckedRows(selectedRows.map(row => ({ ...row, display_info: row.name })))
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record: object) => ({
      name: record.dataIndex,
    }),
  }

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('ID'),
        dataIndex: 'id',
        sorter: true,
      },

      {
        title: renderTitle('Morion'),
        dataIndex: 'morion',
        sorter: true,
      },

      {
        title: renderTitle('Images'),
        dataIndex: 'items',
        sorter: true,
        render: items =>
          items.filter(item => !!item?.url)?.map(item => <Image src={item.url} width={50} height={50} />),
      },

      {
        title: renderTitle('Created at'),
        dataIndex: 'created_at',
        sorter: true,
        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
      },
      {
        title: renderTitle('Updated at'),
        dataIndex: 'updated_at',
        sorter: true,
        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
      },
    ],
    [clickedRowIndex],
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
        onRow={onRow}
        rowSelection={rowSelection}
      />
      <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          {!!state?.id ? 'Update images' : 'Create new images'}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {!state?.id && (
            <TextField
              onChange={onChangeHandle}
              name='morion'
              style={{ marginBottom: '20px' }}
              fullWidth
              placeholder='Type...'
              type='number'
              label='Morion'
              value={state.morion}
              required
            />
          )}

          <div style={{ width: '600px', display: 'flex', justifyContent: 'center' }}>
            {state?.items?.map((item, i) => (
              <UploadRow key={i}>
                <img src={item.url || defaultImg} alt='cropped' />
                <input onChange={e => onChange(e, i)} className='custom-file-input' type='file' />
                {!!item?.id && (
                  <span
                    style={{ cursor: 'pointer', position: 'absolute', top: '0px', right: '40px' }}
                    onClick={() => handleDeleteImage(state.id, item.id)}
                  >
                    <DeleteIcon />
                  </span>
                )}
              </UploadRow>
            ))}
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              !!state?.id ? handleUpdateImages() : handleCreateImages()
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
    </Box>
  )
}
