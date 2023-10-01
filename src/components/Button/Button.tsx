import React, { FC } from 'react'
import { Button as AntdButton, ButtonProps } from 'antd'

interface IProps extends ButtonProps {
  buttonType?: 'add' | 'remove' | 'filter' | 'upload'
  children: React.ReactNode
}

export const Button: FC<IProps> = ({ children, ...rest }) => {
  return <AntdButton {...rest}>{children}</AntdButton>
}
