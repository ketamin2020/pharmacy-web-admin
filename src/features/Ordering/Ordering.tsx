import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import { getOrderList } from 'api/ordered'
import { Tooltip } from 'antd'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import moment from 'moment'

import notification from 'common/Notification/Notification'

import {
  DeliveryTypeTitle,
  PaymentTypeTitle,
  StatusTypeTitle,
  deliveryTypeOptions,
  paymentTypeOptions,
} from './constants'
import { priceToView } from 'utils/priceToView'
import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

export const Ordering = () => {
  const [data, setData] = useState([])

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [checkedRows, setCheckedRows] = useState([])

  const fetchOrderList = async params => {
    try {
      const { data, meta } = await getOrderList(params)
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
    fetchOrderList({ page: pagination.page, per_page: pagination.per_page })
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchOrderList({
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
        title: renderTitle('Client First Name'),
        dataIndex: 'client',
        sorter: true,
        render: client => client?.first_name || '-',
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Client Last Name'),
        dataIndex: 'client',
        sorter: true,
        render: client => client?.last_name || '-',
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Client Middle Name'),
        dataIndex: 'client',
        sorter: true,
        render: client => client?.middle_name || '-',
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Client Phone'),
        dataIndex: 'client',
        sorter: true,
        render: client => client?.phone || '-',
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Comment'),
        dataIndex: 'comment',
        sorter: true,
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Delivery Type'),
        dataIndex: 'delivery_type',
        sorter: true,
        render: value => DeliveryTypeTitle[value],
        filters: deliveryTypeOptions,
        width: 200,
      },
      {
        title: renderTitle('Discount'),
        dataIndex: 'discount',
        sorter: true,
        render: discount => priceToView(discount?.usedBonus),
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Status'),
        dataIndex: 'status',
        sorter: true,
        render: status => StatusTypeTitle?.[status],
        width: 200,
      },
      {
        title: renderTitle('Completed'),
        dataIndex: 'completed',
        sorter: true,
        render: completed => (completed ? 'Yes' : 'No'),
        width: 200,
      },
      {
        title: renderTitle('Total'),
        dataIndex: 'total',
        sorter: true,
        render: total => priceToView(total),
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },

      {
        title: renderTitle('Total to Pay'),
        dataIndex: 'payment',
        sorter: true,
        render: payment => priceToView(payment.price.totalToPay),
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Pay Type'),
        dataIndex: 'payment',
        sorter: true,
        filters: paymentTypeOptions,
        render: payment => PaymentTypeTitle?.[payment.type],
        width: 200,
      },
      {
        title: renderTitle('Werehouse'),
        dataIndex: 'warehouse',
        sorter: true,
        render: warehouse => warehouse?.name,
        width: 200,
      },

      {
        title: renderTitle('Delivery City'),
        dataIndex: 'delivery',
        sorter: true,
        render: warehouse => warehouse?.city?.name,
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Delivery Recepient'),
        dataIndex: 'delivery',
        sorter: true,
        render: warehouse => `${warehouse?.recipient?.first_name} ${warehouse?.recipient?.last_name}`,
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },

      {
        title: renderTitle('Created at'),
        dataIndex: 'created_at',
        sorter: true,
        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
      },
      {
        title: renderTitle('Updated at'),
        dataIndex: 'updated_at',
        sorter: true,
        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        width: 200,
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
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
    </Box>
  )
}
