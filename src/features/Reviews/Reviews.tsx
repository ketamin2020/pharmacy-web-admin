import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'

import { getUsersList } from 'api/users'
import moment from 'moment'
import notification from 'common/Notification/Notification'

import { Tooltip } from 'antd'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { TableActions } from 'components/TableActions/TableActions'

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

export const Reviews = () => {
  const [data, setData] = useState([])

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

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

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('First Name'),
        dataIndex: 'first_name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Middle Name'),
        dataIndex: 'middle_name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Last Name'),
        dataIndex: 'last_name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Phone'),
        dataIndex: 'phone',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Email'),
        dataIndex: 'email',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Basket'),
        dataIndex: 'basket',
        sorter: true,
        render: () => '-',
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Orders'),
        dataIndex: 'orders',
        sorter: true,
        render: () => '-',
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
    ],
    [clickedRowIndex],
  )

  return (
    <Table columns={columns} dataSource={data} pagination={pagination} onChange={handleTableChange} onRow={onRow} />
  )
}
