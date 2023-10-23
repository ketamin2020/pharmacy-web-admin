import * as React from 'react'
import { useState, useEffect, useMemo, ChangeEvent } from 'react'

import Box from '@mui/material/Box'

import { styled as styles } from '@mui/material/styles'

import InputMask from 'react-input-mask'

import { Table } from 'components/Table/Table'
import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import { Tooltip, Modal, Input, Select, Button } from 'antd'
import { getUser, deleteUser, updateUser, createUser } from 'api/users'
import moment from 'moment'
import notification from 'common/Notification/Notification'
import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { TableActions } from 'components/TableActions/TableActions'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

interface Data {
  id: string
  first_name: string
  last_name: string
  phone: string
  email: string

  address: string
  position: string
}

const status = {
  1: 'Active',
  2: 'Inactive',
}
const statusOptions = [
  { value: 1, text: 'Active' },
  { value: 2, text: 'Inactive' },
]

const initData = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  password: '',
  address: '',
  position: '',
}
const reg = /[^\d\+]/g
export const Workers = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])

  const [open, setOpen] = useState(false)

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

  const onChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setState(prev => ({ ...prev, [name]: value }))
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const fetchUsersList = async params => {
    try {
      const { data, meta } = await getUser(params)
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
      await createUser({
        ...state,
        phone: state.phone.replace(reg, ''),
      })
      handleClose()
      await fetchUsersList({ page: 1, per_page: 10 })
      notification('success', 'Worker was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async id => {
    try {
      await deleteUser(id)
      await fetchUsersList({ page: 1, per_page: 10 })
      notification('success', 'Worker was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchUsersList({ page: pagination.page, per_page: pagination.per_page })
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchUsersList({
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
    callbacks: [() => handleDelete(record.id), () => null],
    preloaders: [],
    disabled: [false, false],
    tooltips: ['Remove this user?', 'Edit this user?'],
    popConfirms: ['Are you sure that you want to delete this user?'],
  })

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('Status'),
        dataIndex: 'status',
        sorter: true,
        render: value => status[value],
        filters: statusOptions,
        width: 150,
      },
      {
        title: renderTitle('First Name'),
        dataIndex: 'first_name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Last Name'),
        dataIndex: 'last_name',
        sorter: true,
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Phone'),
        dataIndex: 'phone',
        sorter: true,
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Email'),
        dataIndex: 'email',
        sorter: true,
        width: 300,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Position'),
        dataIndex: 'position',
        sorter: true,
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
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
        Create
      </Button>
      <Table columns={columns} dataSource={data} pagination={pagination} onChange={handleTableChange} onRow={onRow} />

      <Modal
        okText='Save'
        onOk={() => {
          handleCreate()
        }}
        open={open}
        title='Create Worker'
        onCancel={handleClose}
      >
        <Input
          onChange={onChangeHandle}
          name='first_name'
          style={{ marginBottom: '20px' }}
          placeholder='First name'
          required
          value={state.first_name}
        />

        <Input
          onChange={onChangeHandle}
          name='last_name'
          style={{ marginBottom: '20px' }}
          placeholder='Last name'
          required
          value={state.last_name}
        />
        <InputMask
          placeholder='Phone'
          name='phone'
          mask={'+38(999)-99-99-999'}
          maskChar='X'
          value={state.phone}
          onChange={onChangeHandle}
        >
          {inputProps => (
            <Input {...inputProps} style={{ marginBottom: '20px' }} placeholderl='Phone' type='tel' required />
          )}
        </InputMask>

        <Input
          onChange={onChangeHandle}
          name='email'
          style={{ marginBottom: '20px' }}
          placeholder='Email'
          required
          value={state.email}
        />
        <Input
          onChange={onChangeHandle}
          name='password'
          style={{ marginBottom: '20px' }}
          placeholder='Password'
          required
          value={state.password}
        />
        <Input
          onChange={onChangeHandle}
          name='address'
          style={{ marginBottom: '20px' }}
          placeholder='Address'
          required
          value={state.address}
        />

        <Select
          value={state.position}
          style={{ width: '100%' }}
          placeholder='Position'
          labelInValue
          onChange={value => onChangeHandle({ target: { name: 'position', value } })}
        >
          <Select.Option value={'Admin'}>Admin</Select.Option>
          <Select.Option value={'Worker'}>Worker</Select.Option>
          <Select.Option value={'Pharmacist'}>Pharmacist</Select.Option>
          <Select.Option value={'Lawyer'}>Lawyer</Select.Option>
          <Select.Option value={'Partner'}>Partner</Select.Option>
        </Select>
      </Modal>
    </Box>
  )
}
