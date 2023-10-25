import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import InputMask from 'react-input-mask'
import styled from '@emotion/styled'

import { getPartners, deletePartner, updatePartner, createPartner } from 'api/partners'
import moment from 'moment'
import notification from 'common/Notification/Notification'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'

import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { TableActions } from 'components/TableActions/TableActions'
import { Modal, Input, Button, Tooltip } from 'antd'
import TimePicker from 'components/TimePicker/TimePicker'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

const PickerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

interface Data {
  name: string
  full_address: string
  common_phone: string
  common_email: string
  ordering_email: string
  ordering_phone: string
  business_hours: {
    start_time: string
    end_time: string
  }
}

const initData = {
  name: '',
  full_address: '',
  common_phone: '',
  common_email: '',
  ordering_email: '',
  ordering_phone: '',
  business_hours: {
    start_time: moment(),
    end_time: moment(),
  },
}

export const Partners = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])

  const [open, setOpen] = React.useState(false)

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

  const onChangeHandleTimePicker = obj => {
    const { name, value } = obj
    setState(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [name]: value,
      },
    }))
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

  const fetchPartnersList = async params => {
    try {
      const { data, meta } = await getPartners(params)
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
      await createPartner({
        ...state,
        business_hours: {
          start_time: state.business_hours.start_time && state.business_hours.start_time.format('HH:mm'),
          end_time: state.business_hours.end_time && state.business_hours.end_time.format('HH:mm'),
        },
      })
      await fetchPartnersList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Partner was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async id => {
    try {
      await deletePartner(id)
      await fetchPartnersList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Partner was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchPartnersList({ page: pagination.page, per_page: pagination.per_page })
  }, [])
  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchPartnersList({
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
        title: renderTitle('Name'),
        dataIndex: 'name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },

      {
        title: renderTitle('Full Address'),
        dataIndex: 'full_address',
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
        title: renderTitle('Common Email'),
        dataIndex: 'common_email',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Ordering Email'),
        dataIndex: 'ordering_email',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Common Phone'),
        dataIndex: 'common_phone',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Ordering Phone'),
        dataIndex: 'ordering_phone',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
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
      <Button style={{ marginBottom: '10px' }} onClick={handleClickOpen}>
        Add new Partner
      </Button>
      <Table
        size='small'
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
        onRow={onRow}
      />

      <Modal
        title='Create New Partner'
        okText='Create'
        open={open}
        onOk={() => {
          handleCreate()
          handleClose()
        }}
        onCancel={handleClose}
      >
        <Input
          onChange={onChangeHandle}
          name='name'
          style={{ marginBottom: '20px' }}
          placeholder='Name'
          required
          value={state.name}
        />

        <Input
          onChange={onChangeHandle}
          name='full_address'
          style={{ marginBottom: '20px' }}
          placeholder='Address'
          required
          value={state.full_address}
        />
        <InputMask
          name='common_phone'
          mask={'+38(999)-99-99-999'}
          maskChar='X'
          value={state?.common_phone}
          onChange={onChangeHandle}
        >
          {inputProps => <Input style={{ marginBottom: '20px' }} placeholder='Common phone' {...inputProps} />}
        </InputMask>

        <Input
          onChange={onChangeHandle}
          name='common_email'
          style={{ marginBottom: '20px' }}
          placeholder='Common email'
          required
          value={state.common_email}
        />

        <InputMask
          name='ordering_phone'
          mask={'+38(999)-99-99-999'}
          maskChar='X'
          value={state.ordering_phone}
          onChange={onChangeHandle}
        >
          {inputProps => <Input style={{ marginBottom: '20px' }} placeholder='Ordering phone' {...inputProps} />}
        </InputMask>
        <Input
          onChange={onChangeHandle}
          name='ordering_email'
          style={{ marginBottom: '20px' }}
          placeholder='Ordering email'
          value={state.ordering_email}
          required
        />
        <p>Business hours:</p>

        <PickerWrapper>
          <TimePicker
            placeholder='Start'
            name='start_time'
            format='HH:mm'
            value={state.business_hours.start_time}
            onChange={value => onChangeHandleTimePicker({ name: 'start_time', value })}
            style={{ width: '100%' }}
          />

          <TimePicker
            placeholder='End'
            name='end_time'
            format='HH:mm'
            onChange={value => onChangeHandleTimePicker({ name: 'end_time', value })}
            value={state.business_hours.end_time}
            style={{ width: '100%' }}
          />
        </PickerWrapper>
      </Modal>
    </Box>
  )
}
