import React, { useState } from 'react'

import notification from 'common/Notification/Notification'

import { Modal, Input } from 'antd'

import { createPackage } from 'api/package'

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreatePackageModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')

  const handleCreate = async () => {
    if (!state) return
    try {
      await createPackage({ name: state })
      await callback()
      setState('')
      handleClose()
      notification('success', 'Package was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Modal title='Create package' okText='Create' open={open} onOk={handleCreate} onCancel={handleClose}>
      <Input
        onChange={e => setState(e.target.value)}
        name='name'
        style={{ marginBottom: '20px', width: '100%' }}
        placeholder='Package'
        required
        value={state}
      />
    </Modal>
  )
}
