import React, { useState } from 'react'

import notification from 'common/Notification/Notification'

import { createTradeName } from 'api/tradeName'

import { Modal, Input } from 'antd'

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateTradeNameModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')

  const handleCreate = async () => {
    if (!state) return
    try {
      await createTradeName({ name: state })
      notification('success', 'Trade name was created successfuly!')
      await callback()
      setState('')
      handleClose()
    } catch (error) {
      console.log(error)
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Modal title='Create Trade Name' okText='Create' open={open} onCancel={handleClose} onOk={handleCreate}>
      <Input value={state} onChange={e => setState(e.target.value)} autoFocus placeholder='Trade name' type='text' />
    </Modal>
  )
}
