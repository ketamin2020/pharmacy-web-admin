import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'

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
import styled from '@emotion/styled'
import Cropper from 'react-cropper'
import { getMakers, deleteMaker, updateMaker, createMaker } from 'api/makers'
import { Tooltip, Image } from 'antd'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import moment from 'moment'

import notification from 'common/Notification/Notification'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

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

interface Data {
  full_name: string
  short_name: string
  country: string
  factory: string
  logo: object
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

const initData = {
  full_name: '',
  short_name: '',
  country: '',
  factory: '',
}

export const Makers = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('calories')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [open, setOpen] = React.useState(false)
  const [rowSelected, setRowSelected] = useState({})
  const [openCropModal, setOpenCropModal] = useState(false)

  const [image, setImage] = useState(null)
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
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseCropModal = () => {
    setOpenCropModal(false)
  }

  const fetchMakersList = async params => {
    try {
      const { data, meta } = await getMakers(params)
      setPagination({
        page: meta.current,
        page_size: meta.pageSize,
        total: meta.total,
      })
      setData(data)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
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
      await fetchMakersList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Maker was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteMaker(rowSelected.id)
      await fetchMakersList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Maker was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchMakersList({ page: pagination.page, per_page: pagination.per_page })
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchMakersList({
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
        title: renderTitle('Full Name'),
        dataIndex: 'full_name',
        sorter: true,
      },

      {
        title: renderTitle('Short Name'),
        dataIndex: 'short_name',
        sorter: true,
      },
      {
        title: renderTitle('Slug'),
        dataIndex: 'slug',
        sorter: true,
      },
      {
        title: renderTitle('Country'),
        dataIndex: 'country',
        sorter: true,
      },
      {
        title: renderTitle('Factory'),
        dataIndex: 'factory',
        sorter: true,
      },
      {
        title: renderTitle('Logo'),
        dataIndex: 'logo',
        sorter: true,
        render: logo => (!!logo?.url ? <Image src={logo.url} width={50} height={50} /> : '-'),
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
          <Button
            autoFocus
            onClick={() => {
              handleCreate()
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
