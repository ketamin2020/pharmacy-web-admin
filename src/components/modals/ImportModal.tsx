import React, { useState } from 'react'
import Button from '@mui/material/Button'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { read, utils } from 'xlsx'

import { Upload, UploadProps } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
const { Dragger } = Upload

const initState = {
  selectedFile: null,
  showUploadError: false,
  error: '',
  isLoading: false,
}

export const ImportModal = ({ handleClose, open, onSave }) => {
  const [state, setState] = useState(initState)
  const [tempFile, setTempFile] = useState<File | null>(null)
  const [header, setHeaders] = useState([])

  const handleFileChange = (file: File) => {
    setTempFile(file)

    const reader = new FileReader()
    reader.onload = e => {
      const data = new Uint8Array(e.target.result as ArrayBuffer)
      const workbook = read(data, { type: 'array' })

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      const headers = []
      const range = utils.decode_range(worksheet['!ref'])
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = utils.encode_cell({ c: C, r: range.s.r })
        const cell = worksheet[address]
        headers.push({ name: cell.v, index: C })
      }
      setHeaders(headers)
    }

    reader.readAsArrayBuffer(file)
  }
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    customRequest: () => null,
    accept: '.xml,.xlsx,.csv,.xls',
    disabled: !!header?.length,
    beforeUpload: (file: File) => {
      handleFileChange(file)
      return false
    },

    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const handleSave = async () => {
    try {
      const formData = new FormData()
      await formData.append('file', tempFile)
      await formData.append('data', JSON.stringify(state))
      await onSave(formData)
      setState(initState)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClearData = () => {
    setState(initState)
    setTempFile(null)
    setHeaders([])
    handleClose()
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClearData}>
        <DialogTitle>Upload table from Spread Sheet</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to load new data? Existing data will be updated</DialogContentText>
          <Dragger {...props}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click or drag file to this area to upload</p>
            <p className='ant-upload-hint'> Support for a single upload.</p>
          </Dragger>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClearData}>Cancel</Button>
          <Button disabled={!tempFile} onClick={handleSave}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
