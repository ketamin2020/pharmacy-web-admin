import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import IconButton from '@mui/material/IconButton'

import Button from '@mui/material/Button'
import { styled as styles } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'

import { getSubstances, deleteSubstance, updateSubstance, createSubstance } from 'api/substances'

import notification from 'common/Notification/Notification'
import { Tooltip, Image } from 'antd'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import moment from 'moment'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

const BootstrapDialog = styles(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

interface Data {
  name_ua: string
  name_eu: string
}
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

const initData = {
  name_ua: '',
  name_eu: '',
}

export const Substance = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('calories')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [open, setOpen] = React.useState(false)
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
  const handleDelete = async () => {
    try {
      await deleteSubstance(rowSelected.id)
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
        title: renderTitle('Name UA'),
        dataIndex: 'name_ua',
        sorter: true,
      },

      {
        title: renderTitle('Name USA'),
        dataIndex: 'name_eu',
        sorter: true,
      },
      {
        title: renderTitle('Slug'),
        dataIndex: 'slug',
        sorter: true,
      },
      {
        title: renderTitle('Title'),
        dataIndex: 'head_title',
        sorter: true,
      },
      {
        title: renderTitle('Index'),
        dataIndex: 'index',
        sorter: true,
      },

      {
        title: renderTitle('Created at'),
        dataIndex: 'created_at',
        sorter: true,
        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
      },
      {
        title: renderTitle('Updated at'),
        dataIndex: 'updated_at',
        sorter: true,
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
      <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          Create new substance
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TextField
            onChange={onChangeHandle}
            name='name_ua'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Name UA'
            required
            value={state.name_ua}
          />

          <TextField
            onChange={onChangeHandle}
            name='name_eu'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Name EU'
            required
            value={state.name_eu}
          />
        </DialogContent>

        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleCreate()
              handleClose()
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  )
}
