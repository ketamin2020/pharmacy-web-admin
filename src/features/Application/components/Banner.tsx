/* eslint-disable no-irregular-whitespace */
import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import Button from '@mui/material/Button'

import Cropper from 'react-cropper'

import { getBanners, createBanner, deleteBanner } from 'api/banner'
import { uploadSingleFile } from 'api/media'
import notification from 'common/Notification/Notification'
import moment from 'moment'

import { InboxOutlined } from '@ant-design/icons'
import { Tooltip, Image, Modal, Upload, UploadProps } from 'antd'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'

import { SearchFilter } from 'components/Table/components/SearchFilter'
import { TableActions } from 'components/TableActions/TableActions'

const { Dragger } = Upload

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg'

interface Data {
  link: string
  created_at: string
  id: string
}

const initData = {
  id: 0,
  link: '',
  status: 1,
}

const options = [
  {
    value: 1,
    text: 'Active',
  },
  { value: 2, text: 'Inactive' },
]

export const Banner = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])

  const [open, setOpen] = React.useState(false)
  const [openCropModal, setOpenCropModal] = useState(false)

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
        setState({ ...res, link: res.url })
      })
      setIndex(null)

      setCropData(base64)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setState(initData)
    setImage(null)
  }
  const handleCloseCropModal = () => {
    setOpenCropModal(false)
  }

  const fetchBanners = async params => {
    try {
      const { data, meta } = await getBanners(params)
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
      await createBanner(state)

      await fetchBanners({ page: pagination.page, per_page: pagination.per_page })
      handleClose()
      notification('success', 'Images created successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  const handleDeleteImage = async itemId => {
    try {
      await deleteBanner(itemId)
      await fetchBanners({ page: pagination.page, per_page: pagination.per_page })
      handleClose()
      notification('success', 'Images deleted successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  useEffect(() => {
    fetchBanners({ page: pagination.page, per_page: pagination.per_page })
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchBanners({
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

  const handleCustomRequest = ({ file, onSuccess }) => {
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
      setOpenCropModal(true)

      onSuccess('ok')
    }
    reader.readAsDataURL(file)
  }

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    customRequest: handleCustomRequest,
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const tableActionProps = record => ({
    todos: ['delete'],
    callbacks: [() => handleDeleteImage(record.id), () => null],
    preloaders: [],
    disabled: [false, false],
    tooltips: ['Remove this image?', 'Edit this user?'],
    popConfirms: ['Are you sure that you want to delete this image?'],
  })

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('ID'),
        dataIndex: 'id',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Status'),
        dataIndex: 'status',
        sorter: true,
        filters: options,
        render: status => (status === 1 ? 'Active' : 'Inactive'),
      },
      {
        title: renderTitle('Link'),
        dataIndex: 'link',
        sorter: true,
        render: image => <Image src={image} width={50} height={50} alt='' />,
      },

      {
        title: renderTitle('Created at'),
        dataIndex: 'created_at',
        sorter: true,
        width: 200,

        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
      },
      {
        title: renderTitle('Updated at'),
        dataIndex: 'updated_at',
        sorter: true,
        width: 200,

        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
      },
      {
        title: renderTitle('Actions'),
        dataIndex: 'actions',
        sorter: false,
        width: 200,
        render: (value, record) => <TableActions {...tableActionProps(record)} />,
      },
    ],
    [clickedRowIndex],
  )

  return (
    <Box sx={{ width: '100%' }}>
      <div>
        <Button style={{ marginBottom: '10px' }} onClick={handleClickOpen}>
          Add New Image
        </Button>
      </div>
      <Table columns={columns} dataSource={data} pagination={pagination} onChange={handleTableChange} onRow={onRow} />

      <Modal
        title='Create New Banner'
        onOk={() => {
          handleCreateImages()
          handleClose()
        }}
        open={open}
        onCancel={handleClose}
        destroyOnClose
      >
        <Dragger {...props}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>Click or drag file to this area to upload</p>
          <p className='ant-upload-hint'>
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
          </p>
        </Dragger>
      </Modal>

      <Modal
        title='Edit Image'
        onOk={() => {
          getCropData()
          setOpenCropModal(false)
        }}
        onCancel={handleCloseCropModal}
        open={openCropModal}
        destroyOnClose
      >
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
      </Modal>
    </Box>
  )
}
