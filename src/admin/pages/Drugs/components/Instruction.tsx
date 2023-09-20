import * as React from 'react'
import { useRef, useState, useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import { visuallyHidden } from '@mui/utils'
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

interface Data {
  id: string
  morion: number
  section: object
  external_code: string
  name: string
}

function createData(id, morion, section, external_code, name): Data {
  return {
    id,
    morion,
    section,
    external_code,
    name,
  }
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'morion',
    numeric: true,
    disablePadding: false,
    label: 'Morion',
  },
  {
    id: 'external_code',
    numeric: true,
    disablePadding: false,
    label: 'External code',
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Name',
  },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, handleClickOpen, handleDelete } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
          Instructions
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title='Delete'>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit selected'>
            <IconButton onClick={handleClickOpen}>
              <Edit />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title='Add new brand'>
          <IconButton onClick={handleClickOpen}>
            <Add />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}
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

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.name)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string, row) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setRowSelected(row)
    setState(row.section)
    setDefaultState(row.section)
    setCode(row.morion)
    setName(row.name)
    setExternalCode(row.external_code)
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const fetchInstructionsList = async () => {
    try {
      const res = await getInstructions()
      setData(res)
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
      await fetchInstructionsList()
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
      await fetchInstructionsList()
      notification('success', 'Instruction was updated successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteInstruction(rowSelected.id)
      await fetchInstructionsList()
      notification('success', 'Instruction was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchInstructionsList()
  }, [])

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  const rows = data?.map(d => createData(d.id, d.morion, d.section, d.external_code, d.name))

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          handleDelete={handleDelete}
          handleClickOpen={handleClickOpen}
          numSelected={selected.length}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.name, row)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

                      <TableCell component='th' id={labelId} scope='row' padding='none'>
                        {row.id}
                      </TableCell>
                      <TableCell align='left'>{row.morion}</TableCell>
                      <TableCell align='left'>{row.external_code}</TableCell>
                      <TableCell align='left'>{row.name}</TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

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
