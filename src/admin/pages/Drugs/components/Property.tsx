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
import DialogContentText from '@mui/material/DialogContentText'
import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'
import { FormControl } from '@material-ui/core'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import AppBar from '@mui/material/AppBar'

import { TransitionProps } from '@mui/material/transitions'
import Slide from '@mui/material/Slide'

import { getProperties, deleteProperty, updateProperty, createProperty } from 'api/property'
import { getTradeNames, deleteTradeName, updateTradeName, createTradeName } from 'api/tradeName'
import { getForms } from 'api/form'
import { getSubstances } from 'api/substances'
import { getMakers } from 'api/makers'
import { getDosage } from 'api/dosage'
import { getRoutes } from 'api/administrationRoute'
import { getQuantity } from 'api/quantity'
import { getTemperatures } from 'api/temperature'
import { getPackages } from 'api/package'
import notification from 'common/Notification/Notification'
import { getGroups } from 'api/groups'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { Edit } from '@material-ui/icons'
import styled from '@emotion/styled'
import { CreateSubstanceModal } from 'admin/modals/CreateSubstanceModal'
import { CreateTradeNameModal } from 'admin/modals/CreateTradeNameModal'
import { CreateMakerModal } from 'admin/modals/CreateMakerModal'
import { CreateFormModal } from 'admin/modals/CreateFormModal'
import { CreateRouteModal } from 'admin/modals/CreateRouteModal'
import { CreateDosageModal } from 'admin/modals/CreateDosageModal'
import { CreateQuantityModal } from 'admin/modals/CreateQuantityModal'
import { CreateTemperatureModal } from 'admin/modals/CreateTemperatureModal'
import { CreatePackageModal } from 'admin/modals/CreatePackageModal'

interface Film {
  title: string
  year: number
}

const warningsItems = [
  { value: 'Можна', name: 'Можна' },
  { value: 'З обережністю', name: 'З обережністю' },
  { value: 'Заборонено', name: 'Заборонено' },
]

const childItems = [
  { name: 'Заборонено', value: 'Заборонено' },
  { name: 'Дозволено', value: 'Дозволено' },
  { value: 'З обережністю', name: 'З обережністю' },
  { name: 'З 1 року', value: 'З 1 року' },
  { name: 'З 2 років', value: 'З 2 років' },
  { name: 'З 3 років', value: 'З 3 років' },
  { name: 'З 4 років', value: 'З 4 років' },
  { name: 'З 5 років', value: 'З 5 років' },
  { name: 'З 6 років', value: 'З 6 років' },
  { name: 'З 7 років', value: 'З 7 років' },
  { name: 'З 8 років', value: 'З 8 років' },
  { name: 'З 9 років', value: 'З 9 років' },
  { name: 'З 10 років', value: 'З 10 років' },
  { name: 'З 11 років', value: 'З 11 років' },
  { name: 'З 12 років', value: 'З 12 років' },
  { name: 'З 13 років', value: 'З 13 років' },
  { name: 'З 14 років', value: 'З 14 років' },
  { name: 'З 15 років', value: 'З 15 років' },
  { name: 'З 16 років', value: 'З 16 років' },
  { name: 'З 17 років', value: 'З 17 років' },
  { name: 'З 18 років', value: 'З 18 років' },
]

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

function createData(id, morion, attributes, external_code, name): Data {
  return {
    id,
    morion,
    attributes,
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
          Properties
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
  active_ingredient: {
    value: '',
  },
  marked_name: {
    value: '',
  },
  groups: {
    main_group: {
      value: '',
      slug: '',
    },
    first_lavel_group: {
      value: '',
      slug: '',
    },
    second_lavel_group: {
      value: '',
      slug: '',
    },
  },

  manufacturing_country: {
    value: '',
  },
  maker: {
    value: '',
  },
  imported: {
    value: 'Так',
  },
  dosage: {
    value: '',
  },
  production_form: {
    value: '',
  },
  prescription: {
    value: 'Так',
  },
  morion: {
    value: '',
  },
  administration_route: {
    value: '',
  },
  quantity: {
    value: '',
  },

  expiration: {
    value: '',
  },
  atc: {
    value: '',
  },
  storage_temperature: {
    value: '',
  },

  package: {
    value: '',
  },
}

const initWarnings = {
  allergy_warning: {
    value: '',
  },
  diabetes_warning: {
    value: '',
  },
  driving_warning: {
    value: '',
  },
  pregnancy_warning: {
    value: '',
  },
  breastfeeding_warning: {
    value: '',
  },
  alcohol_warning: {
    value: '',
  },
  child_warning: {
    value: '',
  },
}

export const Property = () => {
  const [state, setState] = useState(initData)
  const [warnings, setWarnings] = useState(initWarnings)

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
  const [makers, setMakers] = useState([])
  const [forms, setForms] = useState([])
  const [tradeNames, setTradeNames] = useState([])
  const [route, setRoute] = useState([])
  const [dosage, setDosage] = useState([])
  const [quantity, setQuantity] = useState([])
  const [temperature, setTemperature] = useState([])
  const [packages, setPackages] = useState([])
  const [options, setOptions] = useState<readonly Film[]>([])
  const [groups, setGroups] = useState([])
  const [openTradeNameModal, setOpenTradeNameModal] = useState(false)

  const [openSubstaceModal, setOpenSubstaceModal] = useState(false)
  const [openMakerModal, setOpenMakerModal] = useState(false)
  const [openFormModal, setOpenFormModal] = useState(false)
  const [openRouteModal, setOpenRouteModal] = useState(false)
  const [openDosageModal, setOpenDosageModal] = useState(false)
  const [openQuantityModal, setOpenQuantityModal] = useState(false)
  const [openTemperatureModal, setOpenTemperatureModal] = useState(false)
  const [openPackageModal, setOpenPackageModal] = useState(false)

  const loading = open && options.length === 0

  const onChangeHandle = (e: onChange<HTMLInputElement>) => {
    const { name, value } = e.target

    setState(prev => ({ ...prev, [name]: { ...prev[name], value: value } }))
  }

  const onChangeWarnings = (e: onChange<HTMLInputElement>) => {
    const { name, value } = e.target
    setWarnings(prev => ({ ...prev, [name]: { ...prev[name], value: value } }))
  }
  const onChangeGroups = (e: onChange<HTMLInputElement>) => {
    const { name, value, slug } = e.target
    setState(prev => ({
      ...prev,
      ['groups']: {
        ...prev['groups'],
        [name]: {
          value,
          slug,
        },
      },
    }))
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
    setState(row.attributes.main.items)
    setWarnings(row.attributes.warnings.items)
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

  const fetchPropertiesList = async () => {
    try {
      const res = await getProperties()
      setData(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  const handleCreate = async () => {
    try {
      await createProperty({
        main: state,
        warnings,
        morion: code,
        name,
        external_code: externalCode,
      })
      setSelected([])
      setRowSelected({})
      await fetchPropertiesList()
      notification('success', 'Property was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleUpdate = async () => {
    try {
      await updateProperty({
        id: rowSelected.id,
        main: state,
        warnings: warnings,
        name,
        external_code: externalCode,
        morion: code,
      })
      setSelected([])
      setRowSelected({})
      await fetchPropertiesList()
      notification('success', 'Property was updated successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteProperty(rowSelected.id)
      await fetchPropertiesList()
      setSelected([])
      setRowSelected({})
      notification('success', 'Property was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  const fetchSubstanceList = async () => {
    try {
      const res = await getSubstances()

      setOptions(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchMakersList = async () => {
    try {
      const res = await getMakers()

      setMakers(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchTradeNamesList = async () => {
    try {
      const res = await getTradeNames()

      setTradeNames(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchFormsList = async () => {
    try {
      const res = await getForms()

      setForms(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchRoutesList = async () => {
    try {
      const res = await getRoutes()

      setRoute(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchDosageList = async () => {
    try {
      const res = await getDosage()

      setDosage(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchQuantityList = async () => {
    try {
      const res = await getQuantity()

      setQuantity(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchTemperatureList = async () => {
    try {
      const res = await getTemperatures()

      setTemperature(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchPackagesList = async () => {
    try {
      const res = await getPackages()

      setPackages(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchGroupsList = async () => {
    try {
      const res = await getGroups()

      setGroups(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchPropertiesList()
  }, [])
  useEffect(() => {
    fetchSubstanceList()
  }, [])
  useEffect(() => {
    fetchMakersList()
  }, [])
  useEffect(() => {
    fetchTradeNamesList()
  }, [])
  useEffect(() => {
    fetchFormsList()
  }, [])
  useEffect(() => {
    fetchRoutesList()
  }, [])
  useEffect(() => {
    fetchDosageList()
  }, [])
  useEffect(() => {
    fetchQuantityList()
  }, [])
  useEffect(() => {
    fetchTemperatureList()
  }, [])
  useEffect(() => {
    fetchPackagesList()
  }, [])
  useEffect(() => {
    fetchGroupsList()
  }, [])

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  const rows = data?.map(d => createData(d.id, d.morion, d.attributes, d.external_code, d.name))

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const firstLavelGroup =
    state?.groups?.main_group?.value && groups?.find(g => g.id === state?.groups?.main_group?.value)?.children
  const secondLavelGroup =
    firstLavelGroup && firstLavelGroup?.find(g => g.id === state?.groups?.first_lavel_group?.value)?.children

  console.log(state.groups)
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
              Create New Property
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
          <Wrapper>
            <Row>
              <p>Код Моріон</p>
              <TextField
                fullWidth
                label='Morion'
                required
                size='small'
                type='number'
                onChange={e => setCode(e.target.value)}
                value={code}
              />
            </Row>
            <Row>
              <p>Зовнішній код</p>
              <TextField
                fullWidth
                label='External code'
                size='small'
                type='text'
                onChange={e => setExternalCode(e.target.value)}
                value={externalCode}
              />
            </Row>

            <Row>
              <p>Назва</p>
              <TextField
                fullWidth
                label='Name'
                size='small'
                required
                type='text'
                onChange={e => setName(e.target.value)}
                value={name}
              />
            </Row>

            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>Основна група</p>
              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => groups.find(o => o.id === option)?.group_name}
                options={groups?.map(o => o?.id)}
                onChange={(event, value) =>
                  onChangeGroups({
                    target: {
                      name: 'main_group',
                      value,
                      slug: groups.find(f => f.id === value)?.slug,
                    },
                  })
                }
                value={state?.groups?.main_group?.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Main group'
                    size='small'
                    fullWidth
                    name='active_ingredient'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>
            {!!state?.groups?.main_group?.value && (
              <Row>
                <p style={{ display: 'flex', gap: '10px' }}>1-ша підгрупа</p>
                <Autocomplete
                  id='asynchronous-demo'
                  fullWidth
                  getOptionLabel={option => firstLavelGroup?.find(o => o.id === option)?.group_name}
                  options={firstLavelGroup?.map(o => o?.id)}
                  onChange={(event, value) =>
                    onChangeGroups({
                      target: {
                        name: 'first_lavel_group',
                        value,
                        slug: firstLavelGroup.find(f => f.id === value)?.slug,
                      },
                    })
                  }
                  value={state?.groups?.first_lavel_group?.value || null}
                  size='small'
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='First level'
                      size='small'
                      fullWidth
                      name='first_lavel_group'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress color='inherit' size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Row>
            )}
            {!!state?.groups?.first_lavel_group?.value && (
              <Row>
                <p style={{ display: 'flex', gap: '10px' }}>2-ша підгрупа</p>
                <Autocomplete
                  id='asynchronous-demo'
                  fullWidth
                  getOptionLabel={option => secondLavelGroup?.find(o => o.id === option)?.group_name}
                  options={secondLavelGroup?.map(o => o?.id)}
                  onChange={(event, value) =>
                    onChangeGroups({
                      target: {
                        name: 'second_lavel_group',
                        value,
                        slug: secondLavelGroup.find(f => f.id === value)?.slug,
                      },
                    })
                  }
                  value={state?.groups?.second_lavel_group?.value || null}
                  size='small'
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Second level'
                      size='small'
                      fullWidth
                      name='second_lavel_group'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress color='inherit' size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Row>
            )}

            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>
                Діюча речовина{' '}
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenSubstaceModal(true)}>
                  <Add />
                </span>
              </p>
              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => options.find(o => o.id === option)?.name_ua}
                options={options?.map(o => o?.id)}
                onChange={(event, value) => onChangeHandle({ target: { name: 'active_ingredient', value: value } })}
                value={state.active_ingredient.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Substance'
                    size='small'
                    fullWidth
                    name='active_ingredient'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>

            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>
                Торгівельна назва{' '}
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenTradeNameModal(true)}>
                  <Add />
                </span>
              </p>

              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => tradeNames.find(o => o.id === option)?.name}
                options={tradeNames?.map(o => o?.id)}
                onChange={(event, value) => onChangeHandle({ target: { name: 'marked_name', value: value } })}
                value={state.marked_name.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Trade name'
                    size='small'
                    fullWidth
                    name='active_ingredient'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>

            <Row>
              <p>Країна виробник</p>
              <TextField
                fullWidth
                label='Manufacturing country'
                required
                size='small'
                name='manufacturing_country'
                onChange={onChangeHandle}
                value={state.manufacturing_country.value}
              />
            </Row>

            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>
                Виробник
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenMakerModal(true)}>
                  <Add />
                </span>
              </p>

              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => makers?.find(o => o.id === option)?.full_name}
                options={makers?.map(o => o?.id)}
                onChange={(event, value) => onChangeHandle({ target: { name: 'maker', value: value } })}
                value={state.maker.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Makers'
                    size='small'
                    fullWidth
                    name='maker'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>

            <Row>
              <p>Імпорт</p>

              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={state.imported.value}
                name='imported'
                onChange={onChangeHandle}
                size='small'
              >
                <MenuItem value={'Так'}>Так</MenuItem>
                <MenuItem value={'Ні'}>Ні</MenuItem>
              </Select>
            </Row>

            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>
                Дозування
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenDosageModal(true)}>
                  <Add />
                </span>
              </p>

              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => dosage?.find(o => o.id === option)?.name}
                options={dosage?.map(o => o?.id)}
                onChange={(event, value) => onChangeHandle({ target: { name: 'dosage', value: value } })}
                value={state.dosage.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Dosage'
                    size='small'
                    fullWidth
                    name='dosage'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>
            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>
                Форма
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenFormModal(true)}>
                  <Add />
                </span>
              </p>

              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => forms?.find(o => o.id === option)?.name}
                options={forms?.map(o => o?.id)}
                onChange={(event, value) => onChangeHandle({ target: { name: 'production_form', value: value } })}
                value={state.production_form.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Form'
                    size='small'
                    fullWidth
                    name='production_form'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>
            <Row>
              <p>Без рецепта</p>

              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={state.prescription.value}
                name='prescription'
                onChange={onChangeHandle}
                size='small'
              >
                <MenuItem value={'Так'}>Так</MenuItem>
                <MenuItem value={'Ні'}>Ні</MenuItem>
              </Select>
            </Row>
            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>
                Спосіб введення
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenRouteModal(true)}>
                  <Add />
                </span>
              </p>

              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => route?.find(o => o.id === option)?.name}
                options={route?.map(o => o?.id)}
                onChange={(event, value) => onChangeHandle({ target: { name: 'administration_route', value: value } })}
                value={state.administration_route.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Administration route'
                    size='small'
                    fullWidth
                    name='administration_route'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>
            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>
                Кількість в упаковці
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenQuantityModal(true)}>
                  <Add />
                </span>
              </p>

              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => quantity?.find(o => o.id === option)?.name}
                options={quantity?.map(o => o?.id)}
                onChange={(event, value) => onChangeHandle({ target: { name: 'quantity', value: value } })}
                value={state.quantity.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Quantity'
                    size='small'
                    fullWidth
                    name='quantity'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>
            <Row>
              <p>Термін придатності</p>

              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={state.expiration.value}
                onChange={onChangeHandle}
                name='expiration'
                size='small'
              >
                <MenuItem value={'1 рік'}>1 рік</MenuItem>
                <MenuItem value={'2 роки'}>2 роки</MenuItem>
                <MenuItem value={'3 роки'}>3 роки</MenuItem>
                <MenuItem value={'4 роки'}>4 роки</MenuItem>
                <MenuItem value={'5 років'}>1 років</MenuItem>
                <MenuItem value={'6 років'}>6 років</MenuItem>
              </Select>
            </Row>

            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>
                Температура зберігання
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenTemperatureModal(true)}>
                  <Add />
                </span>
              </p>

              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => temperature?.find(o => o.id === option)?.name}
                options={temperature?.map(o => o?.id)}
                onChange={(event, value) => onChangeHandle({ target: { name: 'storage_temperature', value: value } })}
                value={state.storage_temperature.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Temperature'
                    size='small'
                    fullWidth
                    name='storage_temperature'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>
            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>
                Упаковка
                <span style={{ cursor: 'pointer' }} onClick={() => setOpenPackageModal(true)}>
                  <Add />
                </span>
              </p>

              <Autocomplete
                id='asynchronous-demo'
                fullWidth
                getOptionLabel={option => packages?.find(o => o.id === option)?.name}
                options={packages?.map(o => o?.id)}
                onChange={(event, value) => onChangeHandle({ target: { name: 'package', value: value } })}
                value={state.package.value || null}
                size='small'
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Package'
                    size='small'
                    fullWidth
                    name='package'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Row>

            <p>Кому можна</p>

            <Row>
              <p>Алергікам</p>

              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={warnings.allergy_warning.value}
                onChange={onChangeWarnings}
                name='allergy_warning'
                size='small'
              >
                {warningsItems.map((el, idx) => (
                  <MenuItem key={idx} value={el.value}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </Row>

            <Row>
              <p>Діабетикам</p>
              <FormControl fullWidth>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={warnings.diabetes_warning.value}
                  name='diabetes_warning'
                  onChange={onChangeWarnings}
                  size='small'
                >
                  {warningsItems.map((el, idx) => (
                    <MenuItem key={idx} value={el.value}>
                      {el.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Row>

            <Row>
              <p>Водіям</p>
              <FormControl fullWidth>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={warnings.driving_warning.value}
                  onChange={onChangeWarnings}
                  name='driving_warning'
                  size='small'
                >
                  {warningsItems.map((el, idx) => (
                    <MenuItem key={idx} value={el.value}>
                      {el.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Row>

            <Row>
              <p>Вігітним</p>
              <FormControl fullWidth>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={warnings.pregnancy_warning.value}
                  onChange={onChangeWarnings}
                  name='pregnancy_warning'
                  size='small'
                >
                  {warningsItems.map((el, idx) => (
                    <MenuItem key={idx} value={el.value}>
                      {el.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Row>
            <Row>
              <p>Годуючим матерям</p>
              <FormControl fullWidth>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={warnings.breastfeeding_warning.value}
                  onChange={onChangeWarnings}
                  name='breastfeeding_warning'
                  size='small'
                >
                  {warningsItems.map((el, idx) => (
                    <MenuItem key={idx} value={el.value}>
                      {el.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Row>
            <Row>
              <p>Взаємодія з алкоголем</p>
              <FormControl fullWidth>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={warnings.alcohol_warning.value}
                  onChange={onChangeWarnings}
                  size='small'
                  name='alcohol_warning'
                >
                  {warningsItems.map((el, idx) => (
                    <MenuItem key={idx} value={el.value}>
                      {el.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Row>
            <Row>
              <p>Дітям</p>

              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={warnings.child_warning.value}
                placeholder='Expiration'
                name='child_warning'
                onChange={onChangeWarnings}
                size='small'
              >
                {childItems.map((el, idx) => (
                  <MenuItem key={idx} value={el.value}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </Row>
          </Wrapper>
        </List>
      </Dialog>

      <CreateSubstanceModal
        callback={fetchSubstanceList}
        handleClose={() => setOpenSubstaceModal(false)}
        open={openSubstaceModal}
      />
      <CreateTradeNameModal
        callback={fetchTradeNamesList}
        handleClose={() => setOpenTradeNameModal(false)}
        open={openTradeNameModal}
      />
      <CreateMakerModal callback={fetchMakersList} open={openMakerModal} handleClose={() => setOpenMakerModal(false)} />

      <CreateFormModal callback={fetchFormsList} open={openFormModal} handleClose={() => setOpenFormModal(false)} />
      <CreateRouteModal callback={fetchRoutesList} open={openRouteModal} handleClose={() => setOpenRouteModal(false)} />
      <CreateDosageModal
        callback={fetchDosageList}
        open={openDosageModal}
        handleClose={() => setOpenDosageModal(false)}
      />
      <CreateQuantityModal
        callback={fetchQuantityList}
        open={openQuantityModal}
        handleClose={() => setOpenQuantityModal(false)}
      />
      <CreateTemperatureModal
        callback={fetchTemperatureList}
        open={openTemperatureModal}
        handleClose={() => setOpenTemperatureModal(false)}
      />
      <CreatePackageModal
        callback={fetchPackagesList}
        open={openPackageModal}
        handleClose={() => setOpenPackageModal(false)}
      />
    </Box>
  )
}

const Wrapper = styled.div`
  padding: 20px 100px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  align-content: center;
  border-bottom: 1px solid gray;
  padding: 3px 0;
`
