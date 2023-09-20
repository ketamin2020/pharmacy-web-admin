import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { read, writeFile, utils } from 'xlsx'
import notification from 'common/Notification/Notification'
import { FileOpen } from '@mui/icons-material'
import styled from '@emotion/styled'

const initState = {
  selectedFile: null,
  showUploadError: false,
  error: '',
  isLoading: false,
}

export const ImportModal = ({ handleClose, open }) => {
  const [state, setState] = useState(initState)
  const onChangeHandler = event => {
    let selectedFile = event.target.files[0]
    let rows = []
    let headers
    let el = document.getElementById('errorImportXLS')
    let errorMessage = ''

    const types = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls',
      '.xlsx',
    ]
    let reader = new FileReader()
    reader.onload = function (event) {
      let data = event.target.result
      let workbook = read(data, { type: 'binary' })
      headers = workbook.SheetNames
      rows = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    }

    reader.readAsBinaryString(selectedFile)
    if (
      types.every(
        type =>
          (selectedFile.type && selectedFile.type !== type) ||
          (!selectedFile.type && !/\.xlsx?$/.test(selectedFile.name)),
      )
    ) {
      errorMessage = 'Invalid file type. Please, choose .xls / .xlsx file'
      event.currentTarget.value = ''
      setState(prev => ({
        ...prev,
        showUploadError: true,
        error: 'Invalid file type. Please, choose .xls / .xlsx file',
      }))
    } else {
      setState(prev => ({
        ...prev,
        selectedFile: selectedFile,
        error: '',
      }))
      event.currentTarget.value = ''
    }
  }

  const onSubmitHandler = async () => {
    const data = new FormData()
    data.append('file', state.selectedFile)
    setState(prev => ({ ...prev, isLoading: true }))
    // await itemApi
    //   .importTable(this.props.downloadType, data)
    //   .then(response => {
    //     // this.props.toggleModal()
    //     notification('info', 'Uploading data...')
    //     // this.props.fetchItems(this.props.itemType)
    //     //this.props.initItems()
    //     setState({ selectedFile: null, showUploadError: false, error: '', isLoading: false })
    //     return response
    //   })
    //   .catch(err => {
    //     // ReactDOM.render(err, el);
    //     setState({
    //       showUploadError: true,
    //       isLoading: false,
    //       error: 'Incorrect data in the file. Fix it or select another',
    //     })
    //   })
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setState(initState)
          handleClose()
        }}
      >
        <DialogTitle>Upload table from Spread Sheet</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to load new data? Existing data will be updated</DialogContentText>
          {!state?.selectedFile?.name && (
            <TextField
              onChange={onChangeHandler}
              autoFocus
              margin='dense'
              id='name'
              label='Upload'
              type='file'
              fullWidth
              variant='outlined'
              error={!!state?.error}
              helperText={state?.error}
              focused
            />
          )}
        </DialogContent>
        {!!state?.selectedFile?.name && (
          <FileRow>
            <span>
              <FileOpen />{' '}
            </span>
            <span>{state?.selectedFile?.name}</span>
          </FileRow>
        )}

        <DialogActions>
          <Button
            onClick={() => {
              setState(initState)
              handleClose()
            }}
          >
            Cancel
          </Button>
          <Button disabled={!state?.selectedFile?.name} onClick={onSubmitHandler}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
`
