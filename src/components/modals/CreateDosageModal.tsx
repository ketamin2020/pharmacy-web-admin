import React, { useState } from 'react'

import notification from 'common/Notification/Notification'

import { Modal, Input } from 'antd'

import { createDosage } from 'api/dosage'

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateDosageModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')

  const handleCreate = async () => {
    if (!state) return
    try {
      await createDosage({ name: state })
      await callback()
      setState('')
      handleClose()
      notification('success', 'Dosage was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Modal okText='Create' onOk={handleCreate} title='Create Dosage' onCancel={handleClose} open={open}>
      <Input
        onChange={e => setState(e.target.value)}
        name='name'
        style={{ marginBottom: '20px', width: '100%' }}
        placeholder='Dosage'
        required
        value={state}
      />
    </Modal>
  )
}
