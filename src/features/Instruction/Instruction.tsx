import * as React from 'react'
import { useRef, useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import IconButton from '@mui/material/IconButton'

import { Add } from '@mui/icons-material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'

import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'

import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import AppBar from '@mui/material/AppBar'

import { TransitionProps } from '@mui/material/transitions'
import Slide from '@mui/material/Slide'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { getInstructions, deleteInstruction, updateInstruction, createInstruction } from 'api/instructions'
import notification from 'common/Notification/Notification'

import { Editor } from '@tinymce/tinymce-react'
import { tinyEditorSettings } from 'services/tinyEditor'
import { Edit } from '@material-ui/icons'

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const initData = {
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
    html: '',
    default:
      '<div>Інструкцію лікарського засобу взято з офіційного джерела — <a href="http://www.drlz.com.ua/" target="_blank">Державного реєстру лікарських засобів України</a>.</div>',
  },
}

export const Instruction = () => {
  const [state, setState] = useState(initData)
  const [defaultState, setDefaultState] = useState(initData)
  const [data, setData] = useState([])
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>()
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [open, setOpen] = useState(false)
  const [rowSelected, setRowSelected] = useState({})
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

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [checkedRows, setCheckedRows] = useState([])

  const onChangeHandle = (e: onChange<HTMLInputElement>) => {
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
    setDefaultState(initData)
    setCode(null)
    setName('')
    setExternalCode('')
    setRowSelected('')
    setSelected([])
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
        id: rowSelected.id,
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
  const handleDelete = async () => {
    try {
      await deleteInstruction(rowSelected.id)
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
        title: renderTitle('External Code'),
        dataIndex: 'external_code',
        sorter: true,
      },

      {
        title: renderTitle('Morion'),
        dataIndex: 'morion',
        sorter: true,
      },
      {
        title: renderTitle('Name'),
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: renderTitle('Slug'),
        dataIndex: 'slug',
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

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              Create New Instruction
            </Typography>

            {rowSelected?.id ? (
              <Button
                autoFocus
                color='inherit'
                onClick={() => {
                  handleUpdate()
                  handleClose()
                }}
              >
                update
              </Button>
            ) : (
              <Button
                autoFocus
                color='inherit'
                onClick={() => {
                  handleCreate()
                  handleClose()
                }}
              >
                save
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <List>
          <TextField
            fullWidth
            label='Morion'
            required
            type='number'
            onChange={e => setCode(e.target.value)}
            value={code}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            label='External code'
            type='text'
            onChange={e => setExternalCode(e.target.value)}
            value={externalCode}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            label='Name'
            required
            type='text'
            onChange={e => setName(e.target.value)}
            value={name}
            style={{ marginBottom: '20px' }}
          />
          {Object.entries(state).map(([key, value]) => (
            <Accordion key={key}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                <Typography>{value.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListItem style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} key={key}>
                  <TextField
                    fullWidth
                    name={key}
                    label='Group title'
                    required
                    onChange={onChangeHandle}
                    value={value.title}
                  />
                  <Editor
                    apiKey='your-api-key'
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={defaultState?.[key]?.html}
                    onEditorChange={newValue => onChangeEditorHandle(key, newValue)}
                    init={tinyEditorSettings}
                  />
                </ListItem>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      </Dialog>
    </Box>
  )
}
