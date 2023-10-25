import React from 'react'

import { useState } from 'react'

import notification from 'common/Notification/Notification'

import { Modal, Input } from 'antd'

import { createRoute } from 'api/administrationRoute'

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateRouteModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')

  const handleCreate = async () => {
    if (!state) return
    try {
      await createRoute({ name: state })
      await callback()
      handleClose()
      setState('')
      notification('success', 'Route was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Modal title='Create Route' okText='Save' open={open} onCancel={handleClose} onOk={handleCreate}>
      <Input
        onChange={e => setState(e.target.value)}
        name='name'
        style={{ marginBottom: '20px', width: '100%' }}
        placeholder='Route.'
        required
        value={state}
      />
    </Modal>
  )
}
