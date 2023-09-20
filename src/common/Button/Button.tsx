import React, { ButtonHTMLAttributes, FC } from 'react'
import classNames from 'classnames'
import styles from './Button.module.css'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string
  shape?: string
  buttonCustomClass?: string
  children: JSX.Element
}
const Button: FC<ButtonProps> = ({ color, shape, children, buttonCustomClass, ...props }) => {
  return (
    <button className={classNames(styles.button, styles[color], styles[shape], ...[buttonCustomClass])} {...props}>
      {children}
    </button>
  )
}

export default Button
