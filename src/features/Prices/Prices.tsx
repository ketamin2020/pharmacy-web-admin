/* eslint-disable no-irregular-whitespace */
import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'
import { priceToView } from 'utils/priceToView'
import Box from '@mui/material/Box'

import IconButton from '@mui/material/IconButton'

import Button from '@mui/material/Button'
import { styled as Style } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'

import { getPrices, createPrice, updatePrice, deletePrice, uploadPrice } from 'api/price'
import { getPartners } from 'api/partners'
import { uploadSingleFile } from 'api/media'
import notification from 'common/Notification/Notification'
import moment from 'moment'
import styled from '@emotion/styled'
import { ImportModal } from 'components/modals/ImportModal'
import Autocomplete from '@mui/material/Autocomplete'

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

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

interface Data {
  id: string
  morion: number
  current: number
  createdAt: string
  updatedAt: string
  previous_price: number
}

const initData = {
  morion: 0,
  current: 0,
  code: '',
  partner: 0,
}

export const Prices = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('')
  const [selected, setSelected] = React.useState([])
  const [rowSelected, setRowSelected] = useState({})
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [partners, setPartners] = useState([])
  const [open, setOpen] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [checkedRows, setCheckedRows] = useState([])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = e => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }

  const fetchPrice = async params => {
    try {
      const { data, meta } = await getPrices(params)
      setPagination({
        page: meta.current,
        page_size: meta.pageSize,
        total: meta.total,
      })
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreatePrice = async () => {
    try {
      await createPrice(state)

      await fetchPrice({ page: pagination.page, per_page: pagination.per_page })
      setOpenCreateModal(false)
      notification('success', 'Price created successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }
  const handleUpdatePrice = async () => {
    try {
      await updatePrice(state)

      await fetchPrice({ page: pagination.page, per_page: pagination.per_page })
      setOpenCreateModal(false)
      notification('success', 'Price updated successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  const handleDeletePrice = async itemId => {
    try {
      await deletePrice(itemId)
      await fetchPrice({ page: pagination.page, per_page: pagination.per_page })
      handleClose()
      notification('success', 'Price deleted successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  useEffect(() => {
    fetchPrice({ page: pagination.page, per_page: pagination.per_page })
  }, [])

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await getPartners()
        setPartners(res)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPartners()
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchPrice({
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
        title: renderTitle('Code'),
        dataIndex: 'code',
        sorter: true,
      },
      {
        title: renderTitle('Code Morion'),
        dataIndex: 'morion',
        sorter: true,
      },

      {
        title: renderTitle('Current Price'),
        dataIndex: 'current',
        sorter: true,
        render: value => priceToView(value),
      },
      {
        title: renderTitle('Previous Price'),
        dataIndex: 'previous_price',
        sorter: true,
        render: value => priceToView(value),
      },
      {
        title: renderTitle('Partner'),
        dataIndex: 'partner',
        sorter: true,
        render: value => value?.name || '-',
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

      <ImportModal handleClose={handleClose} open={open} />

      <Dialog
        open={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false)
          setState(initData)
        }}
      >
        <DialogTitle>Add Price</DialogTitle>
        <DialogContent>
          <Autocomplete
            id='asynchronous-demo'
            fullWidth
            getOptionLabel={option => partners.find(o => o.id === option)?.name}
            options={partners?.map(o => o?.id)}
            onChange={(event, value) => handleChange({ target: { name: 'partner', value } })}
            value={state.partner?.id || null}
            size='small'
            renderInput={params => (
              <TextField
                {...params}
                label='Partner'
                size='small'
                fullWidth
                name='partner'
                InputProps={{
                  ...params.InputProps,
                  endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
                }}
              />
            )}
          />
          <TextField
            autoFocus
            margin='dense'
            id='morion'
            label='Code'
            type='number'
            fullWidth
            variant='standard'
            name='code'
            onChange={handleChange}
            value={state.code}
            disabled={!!state?.id}
          />
          <TextField
            autoFocus
            margin='dense'
            id='morion'
            label='Morion'
            type='number'
            fullWidth
            variant='standard'
            name='morion'
            onChange={handleChange}
            value={state.morion}
            disabled={!!state?.id}
          />
          <TextField
            autoFocus
            margin='dense'
            id='morion'
            label='Price'
            type='number'
            fullWidth
            variant='standard'
            name='current'
            onChange={handleChange}
            value={state.current}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenCreateModal(false)
              setState(initData)
            }}
          >
            Cancel
          </Button>
          <Button onClick={!!state?.id ? handleUpdatePrice : handleCreatePrice}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
const UploadRow = styled.div`
  width: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;

  & .custom-file-input::-webkit-file-upload-button {
    visibility: hidden;
  }
  & .custom-file-input::before {
    content: 'Upload';
    display: inline-block;
    background: linear-gradient(top, #f9f9f9, #e3e3e3);
    border: 1px solid #999;
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
  }
  & .custom-file-input:hover::before {
    border-color: black;
  }
  & .custom-file-input:active::before {
    background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
  }
  & img {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: contain;
    object-position: center;
    border: 1px solid #71b9ea;
  }
  & input {
    margin-left: 15px;
  }
`
