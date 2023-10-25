import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import { getSubstances, deleteSubstance, updateSubstance, createSubstance } from 'api/substances'

import notification from 'common/Notification/Notification'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import moment from 'moment'

import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { TableActions } from 'components/TableActions/TableActions'
import { Modal, Input, Button, Tooltip } from 'antd'

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
  name_ua: string
  name_eu: string
}

const initData = {
  name_ua: '',
  name_eu: '',
}

export const Substance = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])

  const [open, setOpen] = React.useState(false)

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

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const fetchSubstanceList = async params => {
    try {
      const { data, meta } = await getSubstances(params)
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
      await createSubstance({
        ...state,
      })
      await fetchSubstanceList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Substance was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async id => {
    try {
      await deleteSubstance(id)
      await fetchSubstanceList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Substance was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchSubstanceList({ page: pagination.page, per_page: pagination.per_page })
  }, [])
  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchSubstanceList({
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
        title: renderTitle('Name UA'),
        dataIndex: 'name_ua',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },

      {
        title: renderTitle('Name USA'),
        dataIndex: 'name_eu',
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
        title: renderTitle('Title'),
        dataIndex: 'head_title',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Index'),
        dataIndex: 'index',
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
      <Button onClick={handleClickOpen} style={{ marginBottom: '10px' }}>
        Create new Substance
      </Button>
      <Table columns={columns} dataSource={data} pagination={pagination} onChange={handleTableChange} onRow={onRow} />

      <Modal
        title='Create new Substance'
        open={open}
        onOk={() => {
          handleCreate()
          handleClose()
        }}
        onCancel={handleClose}
      >
        <Input
          onChange={onChangeHandle}
          name='name_ua'
          style={{ marginBottom: '20px' }}
          placeholder='Name UA'
          required
          value={state.name_ua}
        />

        <Input
          onChange={onChangeHandle}
          name='name_eu'
          style={{ marginBottom: '20px' }}
          placeholder='Name EU'
          required
          value={state.name_eu}
        />
      </Modal>
    </Box>
  )
}
