import React, { useEffect, useState } from 'react'

import { read, utils } from 'xlsx'

import { Upload, UploadProps, Modal, Select, Spin } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'

import { ArrowRight } from '@mui/icons-material'

import { getPartnersList } from 'api/partners'
import notification from 'common/Notification/Notification'

const { Dragger } = Upload

const initHeaders = {
  code: '',
  price: '',
  morion: '',
  partner: '',
}

export const ImportModal = ({ handleClose, open, onSave }) => {
  const [tempFile, setTempFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState([])
  const [selectedHeaders, setSelectedHeaders] = useState(initHeaders)
  const [parners, setPartners] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFileChange = (file: File) => {
    setTempFile(file)

    const reader = new FileReader()
    reader.onload = e => {
      const data = new Uint8Array(e.target.result as ArrayBuffer)
      const workbook = read(data, { type: 'array' })

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      const lastCol = worksheet['!ref'].split(':')[1].replace(/\d/g, '')

      worksheet['!ref'] = `A1:${lastCol}1000`

      const headers = []
      const range = utils.decode_range(worksheet['!ref'])
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = utils.encode_cell({ c: C, r: range.s.r })
        const cell = worksheet[address]

        if (cell && cell.v !== undefined) {
          headers.push({ label: cell.v, value: cell.v })
        } else {
          headers.push({ label: `Header${C + 1}`, value: cell.v })
        }
      }
      setHeaders(headers)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleChangeHeaders = (name, value) => {
    setSelectedHeaders(prev => ({ ...prev, [name]: value }))
  }

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    customRequest: () => null,
    accept: '.xml,.xlsx,.csv,.xls',
    disabled: !!headers?.length,
    beforeUpload: (file: File) => {
      handleFileChange(file)
      return false
    },

    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      await formData.append('file', tempFile)
      await formData.append('data', JSON.stringify(selectedHeaders))
      await onSave(formData)

      notification('success', 'Upload successfuly')
      handleClearData()
    } catch (error) {
      console.error(error)
      notification('error', error?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = () => {
    setTempFile(null)
    setHeaders([])
    setSelectedHeaders(initHeaders)
    handleClose()
  }

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await getPartnersList()
        setPartners(res.map(item => ({ label: item.name, value: item.id })))
      } catch (error) {
        console.error(error)
      }
    }
    fetchPartner()
  }, [])

  return (
    <Modal
      onOk={handleSave}
      okText='Upload'
      title='Upload table from Spread Sheet'
      onCancel={handleClearData}
      centered
      destroyOnClose
      open={open}
    >
      <Spin spinning={loading}>
        <Dragger {...props}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>Click or drag file to this area to upload</p>
          <p className='ant-upload-hint'> Support for a single upload.</p>
        </Dragger>

        {!!headers?.length && (
          <Wrapper>
            <Row>
              <div className='title'>
                <span>Morion</span>
                <span>
                  <ArrowRight />
                </span>
              </div>
              <div>
                <Select
                  onChange={value => handleChangeHeaders('morion', value)}
                  style={{ width: '100%' }}
                  placeholder='Morion'
                  options={headers}
                  value={selectedHeaders.morion}
                />
              </div>
            </Row>
            <Row>
              <div className='title'>
                <span>Internal Code</span>
                <span>
                  <ArrowRight />
                </span>
              </div>
              <div>
                <Select
                  value={selectedHeaders.code}
                  onChange={value => handleChangeHeaders('code', value)}
                  style={{ width: '100%' }}
                  placeholder='Internal Code'
                  options={headers}
                />
              </div>
            </Row>
            <Row>
              <div className='title'>
                <span>Price</span>
                <span>
                  <ArrowRight />
                </span>
              </div>
              <div>
                <Select
                  value={selectedHeaders.price}
                  onChange={value => handleChangeHeaders('price', value)}
                  style={{ width: '100%' }}
                  placeholder='Price'
                  options={headers}
                />
              </div>
            </Row>
            <Row>
              <div className='title'>
                <span>Partner</span>
                <span>
                  <ArrowRight />
                </span>
              </div>
              <div>
                <Select
                  onChange={value => handleChangeHeaders('partner', value)}
                  value={selectedHeaders.partner}
                  style={{ width: '100%' }}
                  placeholder='Partner'
                  options={parners}
                />
              </div>
            </Row>
          </Wrapper>
        )}
      </Spin>
    </Modal>
  )
}

const Wrapper = styled.div`
  margin-top: 30px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  margin-bottom: 20px;
  & .title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`
