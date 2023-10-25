import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import { uploadSingleFile } from 'api/media'

import Cropper from 'react-cropper'
import { getMakers, deleteMaker, updateMaker, createMaker } from 'api/makers'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import moment from 'moment'

import notification from 'common/Notification/Notification'

import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { TableActions } from 'components/TableActions/TableActions'
import { Modal, Input, Button, Tooltip, Image } from 'antd'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

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

const initData = {
  full_name: '',
  short_name: '',
  country: '',
  factory: '',
}

export const Makers = () => {
  const [state, setState] = useState<Data>(initData)
  const [data, setData] = useState([])

  const [open, setOpen] = React.useState(false)

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

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleDelete = async id => {
    try {
      await deleteMaker(id)
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

  const tableActionProps = record => ({
    todos: ['delete'],
    callbacks: [() => handleDelete(record.id), () => null],
    preloaders: [],
    disabled: [false, false],
    tooltips: ['Remove this partner?', 'Edit this partner?'],
    popConfirms: ['Are you sure that you want to delete this partner?'],
  })

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('Full Name'),
        dataIndex: 'full_name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },

      {
        title: renderTitle('Short Name'),
        dataIndex: 'short_name',
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
        title: renderTitle('Country'),
        dataIndex: 'country',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Factory'),
        dataIndex: 'factory',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
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
      <Button onClick={handleClickOpen} style={{ marginBottom: '10px' }}>
        Create new Maker
      </Button>
      <Table columns={columns} dataSource={data} pagination={pagination} onChange={handleTableChange} onRow={onRow} />

      <Modal
        title='Create new Maker'
        open={open}
        onCancel={handleClose}
        onOk={() => {
          handleCreate()
          handleClose()
        }}
      >
        <Input
          onChange={onChangeHandle}
          name='full_name'
          style={{ marginBottom: '20px' }}
          placeholder='Full Name'
          required
          value={state.full_name}
        />

        <Input
          onChange={onChangeHandle}
          name='short_name'
          style={{ marginBottom: '20px' }}
          placeholder='Short Name'
          required
          value={state.short_name}
        />

        <Input
          onChange={onChangeHandle}
          name='country'
          style={{ marginBottom: '20px' }}
          placeholder='Country'
          required
          value={state.country}
        />

        <Input
          onChange={onChangeHandle}
          name='factory'
          style={{ marginBottom: '20px' }}
          placeholder='Factory'
          value={state.factory}
          required
        />
        <Input onChange={onChange} style={{ marginBottom: '20px' }} type='file' />
        {cropData && <img style={{ width: '30%' }} src={cropData} alt='cropped' />}
      </Modal>

      <Modal
        title='Edit'
        onCancel={handleCloseCropModal}
        open={openCropModal}
        onOk={() => {
          getCropData()
          setOpenCropModal(false)
        }}
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
