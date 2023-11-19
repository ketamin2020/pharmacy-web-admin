import React, { useState } from 'react'

import notification from 'common/Notification/Notification'

import { Modal, Input, ColorPicker } from 'antd'

import { createBlogCategory } from 'api/blogs'

interface IProps {
  handleClose: () => void
  callback: () => void
  open: boolean
}
export const CreateBlogCategoryModal = ({ handleClose, callback, open }: IProps) => {
  const [state, setState] = useState('')
  const [color, setColor] = useState('#1677FF')

  const handleCreate = async () => {
    if (!state || !color) return
    try {
      await createBlogCategory({ color, name: state })
      await callback()
      setState('')
      handleClose()
      notification('success', 'Type was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  return (
    <Modal okText='Create' onOk={handleCreate} title='Create Blog Type' onCancel={handleClose} open={open}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>Color</span>
        <ColorPicker defaultFormat='hex' value={color} onChange={(value, hex) => setColor(hex)} />
      </div>
      <Input
        onChange={e => setState(e.target.value)}
        name='name'
        style={{ marginBottom: '20px', width: '100%' }}
        placeholder='Name'
        required
        value={state}
      />
    </Modal>
  )
}
