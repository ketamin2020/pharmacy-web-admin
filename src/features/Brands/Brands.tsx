import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'

import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'
import Cropper from 'react-cropper'
import { createBrand, getBrands, deleteBrand, updateBrand } from 'api/brand'
import { uploadSingleFile } from 'api/media'
import notification from 'common/Notification/Notification'
import moment from 'moment'

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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg'

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

interface Data {
  name: string
  image: string
  url: string
  created_at: string
  id: string
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
  name: '',
  url: '',
}

export const Brands = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('calories')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [rowSelected, setRowSelected] = useState({})
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [open, setOpen] = React.useState(false)
  const [openCropModal, setOpenCropModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)

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

  const onChangeHandle = (e: onChange<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }
  const onChangeUpdateHandle = (e: onChange<HTMLInputElement>) => {
    const { name, value } = e.target
    setRowSelected(prev => ({ ...prev, [name]: value }))
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

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false)
  }

  const fetchBrands = async params => {
    try {
      const { data, meta } = await getBrands(params)
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

  const handleCreateBrand = async () => {
    try {
      const logo = await uploadSingleFile(imageBlob)

      const res = await createBrand({
        ...state,
        logo: {
          ...logo,
        },
      })

      await fetchBrands({ page: pagination.page, per_page: pagination.per_page })

      notification('success', 'Brand created successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  const handleDeleteBrand = async () => {
    try {
      console.log(rowSelected)
      await deleteBrand(rowSelected.id)
      await fetchBrands({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Brand deleted successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  useEffect(() => {
    fetchBrands({ page: pagination.page, per_page: pagination.per_page })
  }, [])
  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchBrands({
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
        title: renderTitle('Name'),
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: renderTitle('URL'),
        dataIndex: 'url',
        sorter: true,
      },
      {
        title: renderTitle('Slug'),
        dataIndex: 'slug',
        sorter: true,
      },
      {
        title: renderTitle('Logo'),
        dataIndex: 'logo',
        sorter: true,
        render: logo => (logo?.url ? <Image src={logo?.url} width={50} height={50} alt='' /> : '-'),
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
          Create new brand
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TextField
            onChange={onChangeHandle}
            name='name'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Name'
          />

          <TextField
            onChange={onChangeHandle}
            name='url'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='https://example.com'
            label='Public URL'
          />
          <TextField onChange={onChange} style={{ marginBottom: '20px' }} fullWidth type='file' />
          {cropData && <img style={{ width: '30%' }} src={cropData} alt='cropped' />}
        </DialogContent>

        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleCreateBrand()
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
      <BootstrapDialog
        onClose={handleCloseUpdateModal}
        aria-labelledby='customized-dialog-title'
        open={openUpdateModal}
      >
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseUpdateModal}>
          Update Brand
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TextField
            onChange={onChangeUpdateHandle}
            name='name'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Name'
            value={rowSelected.name}
          />

          <TextField
            onChange={onChangeUpdateHandle}
            name='url'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='https://example.com'
            label='Public URL'
            value={rowSelected.url}
          />
          <TextField onChange={onChange} style={{ marginBottom: '20px' }} fullWidth type='file' />
          {rowSelected.image && <img style={{ width: '30%' }} src={rowSelected.image} alt='cropped' />}
        </DialogContent>

        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleCreateBrand()
              handleClose()
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  )
}
