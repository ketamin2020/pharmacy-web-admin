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

function createData(
  id,
  name: string,
  full_address: string,
  common_phone: string,
  common_email: string,
  ordering_email: string,
  ordering_phone: string,
  business_hours: string,
): Data {
  return {
    id,
    name,
    full_address,
    common_phone,
    common_email,
    ordering_email,
    ordering_phone,
    business_hours,
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
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'full_address',
    numeric: true,
    disablePadding: false,
    label: 'Full address',
  },
  {
    id: 'common_phone',
    numeric: true,
    disablePadding: false,
    label: 'Common phone',
  },
  {
    id: 'common_email',
    numeric: true,
    disablePadding: false,
    label: 'Common email',
  },
  {
    id: 'ordering_email',
    numeric: true,
    disablePadding: false,
    label: 'Ordring email',
  },
  {
    id: 'ordering_phone',
    numeric: true,
    disablePadding: false,
    label: 'Ordering phone',
  },

  {
    id: 'business_hours',
    numeric: true,
    disablePadding: false,
    label: 'Business hours',
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
          Partners
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
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
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const fetchPartnersList = async () => {
    try {
      const res = await getPartners()
      setData(res)
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
      await fetchPartnersList()
      notification('success', 'Partner was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async () => {
    try {
      await deletePartner(rowSelected.id)
      await fetchPartnersList()
      notification('success', 'Partner was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchPartnersList()
  }, [])

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  const rows = data?.map(d =>
    createData(
      d.id,
      d.name,
      d.full_address,
      d.common_phone,
      d.common_email,
      d.ordering_email,
      d.ordering_phone,
      d.business_hours,
    ),
  )

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
                        {row.name}
                      </TableCell>
                      <TableCell align='left'>{row.full_address}</TableCell>
                      <TableCell align='left'>{row.common_phone}</TableCell>
                      <TableCell align='left'>{row.common_email}</TableCell>
                      <TableCell align='left'>{row.ordering_email}</TableCell>
                      <TableCell align='left'>{row.ordering_phone}</TableCell>
                      <TableCell align='left'>{`${row.business_hours.start_time}-${row.business_hours.end_time}`}</TableCell>
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
