import React from 'react'

import { useState } from 'react'

import notification from 'common/Notification/Notification'

import { Modal, Input } from 'antd'

import { createTemperature } from 'api/temperature'

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateTemperatureModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')

  const handleCreate = async () => {
    if (!state) return
    try {
      await createTemperature({ name: state })
      await callback()
      handleClose()
      setState('')
      notification('success', 'Temperature was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Modal title='Create Temperature' okText='Create' open={open} onCancel={handleClose} onOk={handleCreate}>
      <Input
        onChange={e => setState(e.target.value)}
        name='name'
        style={{ marginBottom: '20px', width: '100%' }}
        placeholder='Temperature'
        required
        value={state}
      />
    </Modal>
  )
}
