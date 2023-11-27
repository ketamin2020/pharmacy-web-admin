import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import { getInstructions, deleteInstruction, updateInstruction, createInstruction } from 'api/instructions'
import notification from 'common/Notification/Notification'

import { Editor } from '@tinymce/tinymce-react'
import { tinyEditorSettings } from 'services/tinyEditor'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'

import moment from 'moment'

import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { TableActions } from 'components/TableActions/TableActions'
import { Modal, Input, Button, Tooltip, Collapse } from 'antd'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

const initData = {
  description: {
    title: 'Опис',
    html: '',
  },
  composition: {
    title: 'Склад',
    html: '',
  },
  medicinal_form: {
    title: 'Лікарська форма',

    html: '',
  },
  medicinal_group: {
    title: 'Фармакотерапевтична група',

    html: '',
  },

  pharmacodynamics: {
    title: 'Фармакодинаміка',
    html: '',
  },
  pharmacokinetics: {
    title: 'Фармакокінетика',
    html: '',
  },
  indications_for_use: {
    title: 'Показання',
    html: '',
  },
  contraindication: {
    title: 'Протипоказання',
    html: '',
  },
  interaction_with_other: {
    title: 'Взаємодія з іншими лікарськими засобами та інші види взаємодій',
    html: '',
  },
  features_of_application: {
    title: 'Особливості застосування',
    html: '',
  },
  ability_to_influence: {
    title: 'Здатність впливати на швидкість реакції при керуванні автотранспортом або іншими механізмами',
    html: '',
  },

  use_during_pregnancy: {
    title: 'Застосування у період вагітності або годування груддю',
    html: '',
  },

  application_and_dosage: {
    title: 'Спосіб застосування та дози',
    html: '',
  },
  children: {
    title: 'Діти',
    html: '',
  },
  overdose: {
    title: 'Передозування',
    html: '',
  },

  adverse_reactions: {
    title: 'Побічні реакції',
    html: '',
  },
  expiration_date: {
    title: 'Термін придатності',
    html: '',
  },
  storage_conditions: {
    title: 'Умови зберігання',
    html: '',
  },
  packaging: {
    title: 'Упаковка',
    html: '',
  },

  leave_category: {
    title: 'Категорія відпуску',
    html: '',
  },
  producer: {
    title: 'Виробник',
    html: '',
  },
  location: {
    title: 'Місцезнаходження виробника та його адреса місця провадження діяльності',
    html: '',
  },

  source_of_instructions: {
    title: 'Джерело інструкції',
    html: '<div>Інструкцію лікарського засобу взято з офіційного джерела — <a href="http://www.drlz.com.ua/" target="_blank">Державного реєстру лікарських засобів України</a>.</div>',
  },
}

export const Instruction = () => {
  const [state, setState] = useState(initData)
  const [clickedRow, setClickedRow] = useState(null)

  const [data, setData] = useState([])

  const [open, setOpen] = useState(false)

  const [code, setCode] = useState()
  const [name, setName] = useState()
  const [externalCode, setExternalCode] = useState()
  const editorRef = useRef(null)

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: { ...prev[name], title: value } }))
  }
  const onChangeEditorHandle = (name, html) => {
    setState(prev => ({ ...prev, [name]: { ...prev[name], html } }))
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setState(initData)
    setCode(null)
    setName('')
    setExternalCode('')
    setClickedRow(null)
  }

  const fetchInstructionsList = async params => {
    try {
      const { data, meta } = await getInstructions(params)
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
      await createInstruction({
        section: state,
        morion: code,
        name,
        external_code: externalCode,
      })
      await fetchInstructionsList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Instruction was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleUpdate = async () => {
    try {
      await updateInstruction({
        id: clickedRow?.id,
        section: state,
        morion: code,
        name,
        external_code: externalCode,
      })
      await fetchInstructionsList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Instruction was updated successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async id => {
    try {
      await deleteInstruction(id)
      await fetchInstructionsList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Instruction was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchInstructionsList({ page: pagination.page, per_page: pagination.per_page })
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchInstructionsList({
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
    todos: ['delete', 'edit'],
    callbacks: [
      () => handleDelete(record.id),
      () => {
        setState(record?.section)
        setCode(record.morion)
        setExternalCode(record.external_code)
        setName(record.name)
        setOpen(true)
        setClickedRow(record)
      },
    ],
    preloaders: [],
    disabled: [false, false],
    tooltips: ['Remove this partner?', 'Edit this partner?'],
    popConfirms: ['Are you sure that you want to delete this partner?'],
  })

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('External Code'),
        dataIndex: 'external_code',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 100,
      },

      {
        title: renderTitle('Morion'),
        dataIndex: 'morion',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 100,
      },
      {
        title: renderTitle('Name'),
        dataIndex: 'name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 400,
      },
      {
        title: renderTitle('Slug'),
        dataIndex: 'slug',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 400,
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

  const colapsedItems = Object.entries(state).map(([key, value]) => ({
    key: key,
    label: value.title,
    children: (
      <>
        {' '}
        <Input
          style={{ marginBottom: '10px' }}
          name={key}
          placeholder='Group Title'
          required
          onChange={onChangeHandle}
          value={value.title}
        />
        <Editor
          apiKey={process.env.REACT_APP_TINY_EDITOR_API_KEY}
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={state?.[key]?.html}
          onEditorChange={newValue => onChangeEditorHandle(key, newValue)}
          init={tinyEditorSettings}
        />
      </>
    ),
  }))

  return (
    <Box sx={{ width: '100%' }}>
      <Button style={{ marginBottom: '10px' }} onClick={handleClickOpen}>
        {' '}
        Create New Instruction
      </Button>
      <Table columns={columns} dataSource={data} pagination={pagination} onChange={handleTableChange} onRow={onRow} />

      <Modal
        destroyOnClose
        centered
        open={open}
        width={1000}
        okText={clickedRow?.id ? 'Update' : 'Create'}
        onOk={
          clickedRow?.id
            ? () => {
                handleUpdate()
                handleClose()
              }
            : () => {
                handleCreate()
                handleClose()
              }
        }
        onCancel={handleClose}
        title='Instruction'
      >
        <Input
          placeholder='Morion'
          required
          type='number'
          onChange={e => setCode(e.target.value)}
          value={code}
          style={{ marginBottom: '20px' }}
        />
        <Input
          placeholder='External code'
          type='text'
          onChange={e => setExternalCode(e.target.value)}
          value={externalCode}
          style={{ marginBottom: '20px' }}
        />
        <Input
          placeholder='Name'
          required
          type='text'
          onChange={e => setName(e.target.value)}
          value={name}
          style={{ marginBottom: '20px' }}
        />
        <Collapse items={colapsedItems} defaultActiveKey={['1']} />
      </Modal>
    </Box>
  )
}
