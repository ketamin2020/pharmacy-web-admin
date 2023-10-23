/* eslint-disable no-irregular-whitespace */
import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { priceToView } from 'utils/priceToView'
import Box from '@mui/material/Box'

import { getPrices, createPrice, updatePrice, deletePrice, uploadPrice } from 'api/price'
import { getPartnersList } from 'api/partners'

import notification from 'common/Notification/Notification'
import moment from 'moment'

import { ImportModal } from 'components/modals/ImportModal'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'

import { TableActions } from 'components/TableActions/TableActions'
import { Button } from 'components/Button/Button'
import styled from '@emotion/styled'
import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { Modal, Input, Select, Tooltip } from 'antd'

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
  morion: '',
  current: '',
  code: '',
  partner: '',
}

export const Prices = () => {
  const [state, setState] = useState(initData)
  const [data, setData] = useState([])

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
    if (name === 'partner') {
      return setState(prev => ({ ...prev, [name]: value }))
    }
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
        const data = await getPartnersList()

        setPartners(data)
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

  const handleClickEdit = record => {
    setState({ ...record, partner: record?.partner?.id })
    setOpenCreateModal(true)
  }

  const tableActionProps = record => ({
    todos: ['delete', 'edit'],
    callbacks: [() => handleDeletePrice(record.id), () => handleClickEdit(record)],
    preloaders: [],
    disabled: [false, false],
    tooltips: ['Remove this price?', 'Edit this price?'],
    popConfirms: ['Are you sure that you want to delete this price?'],
  })

  const handleSave = async importData => {
    try {
      await uploadPrice(importData)
      fetchPrice({ page: pagination.page, per_page: pagination.per_page })
      handleClose()
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('Code'),
        dataIndex: 'code',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Code Morion'),
        dataIndex: 'morion',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },

      {
        title: renderTitle('Current Price'),
        dataIndex: 'current',
        sorter: true,
        render: value => priceToView(value),
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Previous Price'),
        dataIndex: 'previous_price',
        sorter: true,
        render: value => priceToView(value),
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Partner'),
        dataIndex: 'partner',
        sorter: true,
        render: value => value?.name || '-',
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
      },
      {
        title: renderTitle('Created at'),
        dataIndex: 'created_at',
        sorter: true,
        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
      },
      {
        title: renderTitle('Updated at'),
        dataIndex: 'updated_at',
        sorter: true,
        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
      },
      {
        title: renderTitle('Actions'),
        dataIndex: 'actions',
        sorter: false,
        render: (value, record) => <TableActions {...tableActionProps(record)} />,
      },
    ],
    [clickedRowIndex],
  )

  return (
    <Box sx={{ width: '100%' }}>
      <ControlsWrapper>
        <Button
          onClick={() => {
            setOpenCreateModal(true)
          }}
        >
          Create New
        </Button>
        <Button onClick={handleClickOpen}>Import Price</Button>
      </ControlsWrapper>

      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
        onRow={onRow}
        rowSelection={rowSelection}
      />

      <ImportModal onSave={handleSave} handleClose={handleClose} open={open} />

      {/* <Dialog
        open={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false)
          setState(initData)
        }}
      >
        <DialogTitle>{!!state?.id ? 'Update Price' : 'Add Price'} </DialogTitle>
        <DialogContent>
          <Autocomplete
            id='asynchronous-demo'
            fullWidth
            getOptionLabel={option => partners.find(o => o.id === option)?.name}
            options={partners?.map(o => o?.id) || []}
            onChange={(event, value) => handleChange({ target: { name: 'partner', value } })}
            value={state.partner || null}
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
          <Button onClick={!!state?.id ? handleUpdatePrice : handleCreatePrice}>
            {!!state?.id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog> */}

      <Modal
        title={!!state?.id ? 'Update Price' : 'Add Price'}
        open={openCreateModal}
        onCancel={() => {
          setOpenCreateModal(false)
          setState(initData)
        }}
        onOk={!!state?.id ? handleUpdatePrice : handleCreatePrice}
        okText={!!state?.id ? 'Update' : 'Create'}
      >
        <Select
          placeholder='Partner'
          style={{ width: '100%', marginBottom: '20px' }}
          onChange={value => handleChange({ target: { name: 'partner', value } })}
          options={partners?.map(item => ({ value: item?.id, label: item.name }))}
        />
        <Input
          placeholder='Code'
          type='number'
          name='code'
          onChange={handleChange}
          value={state.code}
          disabled={!!state?.id}
          style={{ marginBottom: '20px' }}
        />
        <Input
          placeholder='Morion'
          type='number'
          name='morion'
          onChange={handleChange}
          value={state.morion}
          disabled={!!state?.id}
          style={{ marginBottom: '20px' }}
        />
        <Input
          autoFocus
          placeholder='Price'
          type='number'
          name='current'
          onChange={handleChange}
          value={state.current}
          style={{ marginBottom: '20px' }}
        />
      </Modal>
    </Box>
  )
}

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`
