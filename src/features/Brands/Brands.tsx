import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import { TextField } from '@mui/material'
import Cropper from 'react-cropper'
import { createBrand, getBrands, deleteBrand, updateBrand } from 'api/brand'
import { uploadSingleFile } from 'api/media'
import notification from 'common/Notification/Notification'
import moment from 'moment'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'

import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { TableActions } from 'components/TableActions/TableActions'
import { Modal, Input, Upload, Button, Tooltip, Image } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

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

const initData = {
  name: '',
  url: '',
}
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export const Brands = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])

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

  const [loading, setLoading] = useState(false)

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    setLoading(true)

    getBase64(info.file.originFileObj as RcFile, url => {
      setOpenCropModal(true)
      setImage(url)
      setLoading(false)
      setCropData(null)
    })
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

  const handleDeleteBrand = async id => {
    try {
      await deleteBrand(id)
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

  const tableActionProps = record => ({
    todos: ['delete', 'edit'],
    callbacks: [() => handleDeleteBrand(record.id), () => null],
    preloaders: [],
    disabled: [false, false],
    tooltips: ['Remove this user?', 'Edit this user?'],
    popConfirms: ['Are you sure that you want to delete this user?'],
  })

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('ID'),
        dataIndex: 'id',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Name'),
        dataIndex: 'name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('URL'),
        dataIndex: 'url',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Slug'),
        dataIndex: 'slug',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <Box sx={{ width: '100%' }}>
      <div style={{ marginBottom: '10px' }}>
        <Button onClick={handleClickOpen}>Create Brand</Button>
      </div>
      <Table columns={columns} dataSource={data} pagination={pagination} onChange={handleTableChange} onRow={onRow} />

      <Modal
        onOk={() => {
          handleCreateBrand()
          handleClose()
        }}
        title='Create New Brand'
        open={open}
        onCancel={handleClose}
      >
        <Input
          onChange={onChangeHandle}
          name='name'
          style={{ marginBottom: '20px' }}
          value={state.name}
          placeholder='Name'
        />

        <Input
          onChange={onChangeHandle}
          name='url'
          style={{ marginBottom: '20px' }}
          value={state.url}
          placeholder='Public URL'
        />
        <Upload
          name='avatar'
          listType='picture-card'
          className='avatar-uploader'
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {cropData ? <img src={cropData} alt='avatar' style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </Modal>

      <Modal
        onOk={() => {
          getCropData()
          setOpenCropModal(false)
        }}
        title='Edit Image'
        onCancel={handleCloseCropModal}
        open={openCropModal}
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

      <Modal
        onOk={() => {
          handleCreateBrand()
          handleClose()
        }}
        title='Update Brand'
        onCancel={handleCloseUpdateModal}
        open={openUpdateModal}
      >
        <Input
          onChange={onChangeHandle}
          name='name'
          style={{ marginBottom: '20px' }}
          placeholder='Name'
          label='Name'
          value={state.name}
        />

        <TextField
          onChange={onChangeHandle}
          name='url'
          style={{ marginBottom: '20px' }}
          placeholder='Public URL'
          label='Public URL'
          value={state.url}
        />

        <Upload
          name='avatar'
          listType='picture-card'
          className='avatar-uploader'
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {cropData ? <img src={cropData} alt='avatar' style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </Modal>
    </Box>
  )
}
