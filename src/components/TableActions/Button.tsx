import React from 'react'
import { Popconfirm, Tooltip, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { Delete, Visibility, Close, Add, Edit, ContentCopy, Email, Phone } from '@mui/icons-material'

const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />

export const Button = ({
  type,
  action,
  preloader,
  tooltip,
  popConfirm,
  tooltipPlacement = 'top',
  disabled,
  getPopupContainer,
  popConfirmPosition,
}) => {
  let buttonColor = ''
  let icon = ''
  switch (type) {
    case 'delete': {
      icon = <Delete />
      break
    }
    case 'view': {
      icon = <Visibility />
      break
    }

    case 'close': {
      icon = <Close />
      break
    }
    case 'add': {
      icon = <Add />

      break
    }
    case 'edit': {
      icon = <Edit />
      break
    }
    case 'copy': {
      icon = <ContentCopy />
      break
    }

    case 'mail': {
      icon = <Email />
      break
    }
    case 'phone': {
      icon = <Phone />
      break
    }

    default: {
      break
    }
  }
  const onCancelConfirm = () => {}
  const onClickWhenPopConfirm = e => e.preventDefault()

  return !preloader ? (
    <Tooltip title={tooltip} placement={tooltipPlacement}>
      <Popconfirm
        placement={popConfirmPosition ? popConfirmPosition : 'rightTop'}
        title={/\?$/.test(popConfirm) ? popConfirm : `Are you sure you want to ${type} ${popConfirm}?`}
        onConfirm={action}
        onCancel={onCancelConfirm}
        okText='Yes'
        cancelText='No'
        disabled={!popConfirm || disabled}
        getPopupContainer={getPopupContainer ? getPopupContainer : undefined}
      >
        <button
          className={`btn btn-light ${type}${disabled ? ' disabled' : ''}`}
          onClick={!popConfirm ? action : onClickWhenPopConfirm}
          disabled={!!preloader || disabled}
        >
          {icon}
        </button>
      </Popconfirm>
    </Tooltip>
  ) : (
    <button className={`btn btn-light ${type}`}>{<Spin indicator={antIcon} />}</button>
  )
}
