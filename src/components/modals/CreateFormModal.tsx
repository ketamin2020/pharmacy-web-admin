import React, { useState } from 'react'

import notification from 'common/Notification/Notification'

import { Modal, Input } from 'antd'

import { createForm } from 'api/form'

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateFormModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')

  const handleCreate = async () => {
    if (!state) return
    try {
      await createForm({ name: state })
      await callback()
      handleClose()
      setState('')
      notification('success', 'Form was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Modal okText='Create' onOk={handleCreate} title='Create new Form' open={open} onCancel={handleClose}>
      <Input
        onChange={e => setState(e.target.value)}
        name='name'
        style={{ marginBottom: '20px', width: '100%' }}
        placeholder='Form'
        required
        value={state}
      />
    </Modal>
  )
}
