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
import InputMask from 'react-input-mask'
import styled from '@emotion/styled'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { getPartners, deletePartner, updatePartner, createPartner } from 'api/partners'
import moment from 'moment'
import notification from 'common/Notification/Notification'

import { Tooltip, Image } from 'antd'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'

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
`
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
  name: '',
  full_address: '',
  common_phone: '',
  common_email: '',
  ordering_email: '',
  ordering_phone: '',
  business_hours: {
    start_time: '',
    end_time: '',
  },
}

export const Partners = () => {
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
  const handleDelete = async () => {
    try {
      await deletePartner(rowSelected.id)
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
      },

      {
        title: renderTitle('Full Address'),
        dataIndex: 'full_address',
        sorter: true,
      },
      {
        title: renderTitle('Slug'),
        dataIndex: 'slug',
        sorter: true,
      },
      {
        title: renderTitle('Common Email'),
        dataIndex: 'common_email',
        sorter: true,
      },
      {
        title: renderTitle('Ordering Email'),
        dataIndex: 'ordering_email',
        sorter: true,
      },
      {
        title: renderTitle('Common Phone'),
        dataIndex: 'common_phone',
        sorter: true,
      },
      {
        title: renderTitle('Ordering Phone'),
        dataIndex: 'ordering_phone',
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
          Create new partner
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TextField
            onChange={onChangeHandle}
            name='name'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Name'
            required
            value={state.name}
          />

          <TextField
            onChange={onChangeHandle}
            name='full_address'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Address'
            required
            value={state.full_address}
          />
          <InputMask
            name='common_phone'
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
                label='Common phone'
                {...inputProps}
                type='tel'
                required
              />
            )}
          </InputMask>

          <TextField
            onChange={onChangeHandle}
            name='common_email'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Common email'
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
            {inputProps => (
              <TextField
                variant='outlined'
                style={{ marginBottom: '20px' }}
                fullWidth
                label='Ordering phone'
                {...inputProps}
                type='tel'
                required
              />
            )}
          </InputMask>
          <TextField
            onChange={onChangeHandle}
            name='ordering_email'
            style={{ marginBottom: '20px' }}
            fullWidth
            placeholder='Type...'
            label='Ordering email'
            value={state.ordering_email}
            required
          />
          <p>Business hours:</p>

          <PickerWrapper>
            <TimePicker
              label='Start'
              name='start_time'
              inputFormat='HH:mm'
              mask='__:__'
              value={state.business_hours.start_time}
              onChange={value => onChangeHandleTimePicker({ name: 'start_time', value })}
              renderInput={params => <TextField label='Start' {...params} />}
            />

            <TimePicker
              label='End'
              name='end_time'
              inputFormat='HH:mm'
              mask='__:__'
              onChange={value => onChangeHandleTimePicker({ name: 'end_time', value })}
              value={state.business_hours.end_time}
              renderInput={params => <TextField label='End' {...params} />}
            />
          </PickerWrapper>
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
