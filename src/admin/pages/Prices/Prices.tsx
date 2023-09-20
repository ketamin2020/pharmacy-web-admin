/* eslint-disable no-irregular-whitespace */
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
import { Upload } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { priceToView } from 'utils/priceToView'
import { visuallyHidden } from '@mui/utils'
import { Add } from '@mui/icons-material'
import { Edit } from '@material-ui/icons'
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
import { ImportModal } from 'admin/modals/ImportModal'
import Autocomplete from '@mui/material/Autocomplete'
const BootstrapDialog = Style(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg'

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

function createData(id, morion, updatedAt, current, previous_price, createdAt, code, partner): Data {
  return {
    id,
    morion,
    updatedAt,
    current,
    createdAt,
    code,
    previous_price,
    partner,
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
    id: 'code',
    numeric: true,
    disablePadding: false,
    label: 'Code',
  },
  {
    id: 'patner',
    numeric: true,
    disablePadding: false,
    label: 'Partner',
  },

  {
    id: 'morion',
    numeric: true,
    disablePadding: false,
    label: 'Morion',
  },

  {
    id: 'current',
    numeric: true,
    disablePadding: false,
    label: 'Current Price',
  },
  {
    id: 'previous_price',
    numeric: true,
    disablePadding: false,
    label: 'Previous Price',
  },
  {
    id: 'updatedAt',
    numeric: true,
    disablePadding: false,
    label: 'Updated',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'Created',
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
            // align={headCell.numeric ? 'right' : 'left'}
            align={'center'}
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
  const { numSelected, handleClickOpen, handleClickUpdate, handleDeletePrice, rowSelectedId, handleClickCreate } = props

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
          Prices
        </Typography>
      )}
      <Tooltip title='Upload price'>
        <IconButton onClick={handleClickOpen}>
          <Upload />
        </IconButton>
      </Tooltip>

      <Tooltip title='Add new price'>
        <IconButton onClick={handleClickCreate}>
          <Add />
        </IconButton>
      </Tooltip>
      {numSelected === 1 && (
        <>
          <Tooltip title='Delete'>
            <IconButton onClick={() => handleDeletePrice(rowSelectedId)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit'>
            <IconButton onClick={handleClickUpdate}>
              <Edit />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  )
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
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [rowSelected, setRowSelected] = useState({})
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [partners, setPartners] = useState([])
  const [open, setOpen] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)

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

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string, row: Data) => {
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

    setSelected(newSelected)
    setRowSelected(row)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const fetchBanners = async () => {
    try {
      const res = await getPrices()
      setData(res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreatePrice = async () => {
    try {
      await createPrice(state)

      await fetchBanners()
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

      await fetchBanners()
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
      await fetchBanners()
      handleClose()
      notification('success', 'Price deleted successfuly!')
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong')
    }
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0
  const rows = data?.map(d =>
    createData(d.id, d.morion, d.updatedAt, d.current, d.previous_price, d.createdAt, d.code, d.partner),
  )

  useEffect(() => {
    fetchBanners()
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

  console.log(state)

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          handleClickUpdate={() => {
            setState(rows?.find(r => r.id === selected?.[0]))
            setOpenCreateModal(true)
          }}
          handleClickCreate={() => setOpenCreateModal(true)}
          handleClickOpen={handleClickOpen}
          handleDeletePrice={handleDeletePrice}
          numSelected={selected.length}
          rowSelectedId={selected?.[0]}
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
                  const isItemSelected = isSelected(row.id)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.id, row)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
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
                      <TableCell align='center' component='th' id={labelId} scope='row' padding='none'>
                        {row.id}
                      </TableCell>
                      <TableCell align='center' component='th' id={labelId} scope='row' padding='none'>
                        {row.code}
                      </TableCell>
                      <TableCell align='center' component='th' id={labelId} scope='row' padding='none'>
                        {row.partner?.name}
                      </TableCell>
                      <TableCell align='center' component='th' id={labelId} scope='row' padding='none'>
                        {row.morion}
                      </TableCell>

                      <TableCell align='center' component='th' id={labelId} scope='row' padding='none'>
                        {priceToView(row.current)}
                      </TableCell>
                      <TableCell align='center' component='th' id={labelId} scope='row' padding='none'>
                        {priceToView(row.previous_price)}
                      </TableCell>
                      <TableCell align='center' component='th' id={labelId} scope='row' padding='none'>
                        {moment(row.updatedAt).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell align='center'>{moment(row.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
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
