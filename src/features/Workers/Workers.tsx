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
import { Select, TextField } from '@mui/material'
import InputMask from 'react-input-mask'
import { FormControl, InputLabel, MenuItem } from '@mui/material'
import { Table } from 'components/Table/Table'
import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import { Tooltip, Modal } from 'antd'
import { getUser, deleteUser, updateUser, createUser } from 'api/users'
import moment from 'moment'
import notification from 'common/Notification/Notification'

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
  id: string
  first_name: string
  last_name: string
  phone: string
  email: string

  address: string
  position: string
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

const status = {
  1: 'Active',
  2: 'Inactive',
}

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
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('first_name')

  const [open, setOpen] = useState(false)
  const [rowSelected, setRowSelected] = useState({})

  const [loading, setLoading] = useState(false)

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
  const handleDelete = async () => {
    try {
      await deleteUser(rowSelected.id)
      await fetchUsersList({ page: 1, per_page: 10 })
      notification('success', 'Worker was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchUsersList({ page: pagination.page, per_page: pagination.per_page })
  }, [])

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
        title: renderTitle('Status'),
        dataIndex: 'status',
        sorter: true,
        render: value => status[value],
      },
      {
        title: renderTitle('First Name'),
        dataIndex: 'first_name',
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
        title: renderTitle('Position'),
        dataIndex: 'position',
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
          Create new workers
        </BootstrapDialogTitle>

        <DialogContent dividers>
          <TextField
            onChange={onChangeHandle}
            name='first_name'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='First name'
            required
            value={state.first_name}
          />

          <TextField
            onChange={onChangeHandle}
            name='last_name'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Last name'
            required
            value={state.last_name}
          />
          <InputMask
            name='phone'
            mask={'+38(999)-99-99-999'}
            maskChar='X'
            value={state.phone}
            onChange={onChangeHandle}
          >
            {inputProps => (
              <TextField
                variant='outlined'
                fullWidth
                style={{ marginBottom: '20px' }}
                label='Phone'
                {...inputProps}
                type='tel'
                required
              />
            )}
          </InputMask>

          <TextField
            onChange={onChangeHandle}
            name='email'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Email'
            required
            value={state.email}
          />
          <TextField
            onChange={onChangeHandle}
            name='password'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Password'
            required
            value={state.password}
          />
          <TextField
            onChange={onChangeHandle}
            name='address'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Address'
            required
            value={state.address}
          />

          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Position</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={state.position}
              label='Position'
              name='position'
              onChange={onChangeHandle}
            >
              <MenuItem value={'Admin'}>Admin</MenuItem>
              <MenuItem value={'Worker'}>Worker</MenuItem>
              <MenuItem value={'Pharmacist'}>Pharmacist</MenuItem>
              <MenuItem value={'Lawyer'}>Lawyer</MenuItem>
              <MenuItem value={'Partner'}>Partner</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleCreate()
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  )
}
