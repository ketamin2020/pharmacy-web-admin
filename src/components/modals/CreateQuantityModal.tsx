import React, { useState } from 'react'

import notification from 'common/Notification/Notification'

import { Modal, Input } from 'antd'

import { createQuantity } from 'api/quantity'

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateQuantityModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')

  const handleCreate = async () => {
    if (!state) return
    try {
      await createQuantity({ name: state })
      await callback()
      handleClose()
      setState('')
      notification('success', 'Qty was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Modal title='Create Quantity' okText='Create' open={open} onCancel={handleClose} onOk={handleCreate}>
      <Input
        onChange={e => setState(e.target.value)}
        name='name'
        style={{ marginBottom: '20px', width: '100%' }}
        placeholder='Qty'
        required
        value={state}
      />
    </Modal>
  )
}
