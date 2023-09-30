import { Navigate, RouteProps } from 'react-router-dom'
import { ComponentType } from 'react'

export const withAuth = (Component: ComponentType<any>) => {
  const isAuth: null | string =
    JSON.parse(localStorage.getItem('auth') as string)?.token || null
  console.log(isAuth, 'isAuth')
  return !isAuth ? <Navigate to='/login' /> : Component
}
