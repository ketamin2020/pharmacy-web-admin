import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import { Tooltip, Image } from 'antd'
import { getDrugsList } from 'api/drugs'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import moment from 'moment'

import notification from 'common/Notification/Notification'
import { priceToView } from 'utils/priceToView'
import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

export const Drugs = () => {
  const [data, setData] = useState([])

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [checkedRows, setCheckedRows] = useState([])

  const fetchDrugsList = async params => {
    try {
      const { data, meta } = await getDrugsList(params)
      setPagination({
        page: meta.current_page,
        pageSize: meta.page_size,
        total: meta.total_items,
      })
      setData(data)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchDrugsList({ page: pagination.page, per_page: pagination.per_page })
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchDrugsList({
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
        title: renderTitle('Name'),
        dataIndex: 'name',
        sorter: true,
        width: 350,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },

      {
        title: renderTitle('Morion'),
        dataIndex: 'morion',
        sorter: true,
        width: 100,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('External Code'),
        dataIndex: 'external_code',
        sorter: true,
        width: 100,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Slug'),
        dataIndex: 'slug',
        sorter: true,
        width: 350,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Marked Name'),
        dataIndex: 'marked_name',
        sorter: true,
        render: name => name?.name,
        width: 250,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Price'),
        dataIndex: 'price',
        sorter: true,
        width: 100,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        render: price => priceToView(price?.current),
      },
      {
        title: renderTitle('Images'),
        dataIndex: 'images',
        sorter: true,
        width: 250,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        render: images =>
          images?.items
            ?.filter(item => !!item?.url)
            .map(item => <Image key={item.url} src={item.url} width={50} height={50} />),
      },
      {
        title: renderTitle('Reviews'),
        dataIndex: 'reviews',
        sorter: true,
        width: 100,
        render: reviews => reviews?.length || 0,
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
