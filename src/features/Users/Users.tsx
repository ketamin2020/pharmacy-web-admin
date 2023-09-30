import * as React from 'react'
import { useRef, useState, useEffect, useMemo, onChange } from 'react'

import { getUsersList, deleteUser, updateUser, createUser } from 'api/users'
import moment from 'moment'
import notification from 'common/Notification/Notification'

import { Tooltip } from 'antd'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

const initData = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  full_address: '',
  position: '',
  password: '',
}

export const Users = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('calories')
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [open, setOpen] = useState(false)
  const [rowSelected, setRowSelected] = useState({})
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

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const fetchUsersList = async params => {
    try {
      const { data, meta } = await getUsersList(params)
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
      })
      await fetchUsersList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Partner was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteUser(rowSelected.id)
      await fetchUsersList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Partner was deleted successfuly!')
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
        title: renderTitle('First Name'),
        dataIndex: 'first_name',
        sorter: true,
      },
      {
        title: renderTitle('Middle Name'),
        dataIndex: 'middle_name',
        sorter: true,
      },
      {
        title: renderTitle('Last Name'),
        dataIndex: 'last_name',
        sorter: true,
      },
      {
        title: renderTitle('Phone'),
        dataIndex: 'phone',
        sorter: true,
      },
      {
        title: renderTitle('Email'),
        dataIndex: 'email',
        sorter: true,
      },
      {
        title: renderTitle('Basket'),
        dataIndex: 'basket',
        sorter: true,
        render: () => '-',
      },
      {
        title: renderTitle('Orders'),
        dataIndex: 'orders',
        sorter: true,
        render: () => '-',
      },
    ],
    [clickedRowIndex],
  )

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={handleTableChange}
      onRow={onRow}
      rowSelection={rowSelection}
    />
  )
}
