import React, { ChangeEvent, useState } from 'react'

import notification from 'common/Notification/Notification'

import { createSubstance } from 'api/substances'
import { Modal, Input } from 'antd'

const initData = {
  name_ua: '',
  name_eu: '',
}
interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateSubstanceModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState(initData)
  const onChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }
  const handleCreate = async () => {
    try {
      await createSubstance(state)
      await callback()
      handleClose()
      setState(initData)
      notification('success', 'Substance was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Modal title='Create new Substance' okText='Create' open={open} onCancel={handleClose} onOk={handleCreate}>
      <Input
        onChange={onChangeHandle}
        name='name_ua'
        style={{ marginBottom: '20px' }}
        placeholder='Name UA'
        required
        value={state.name_ua}
      />

      <Input
        onChange={onChangeHandle}
        name='name_eu'
        style={{ marginBottom: '20px' }}
        placeholder='Name EU'
        value={state.name_eu}
      />
    </Modal>
  )
}
