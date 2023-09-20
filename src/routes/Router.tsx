import React from 'react'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import { adminRoutes } from './routes'
import { useSelector } from 'react-redux'

import { Navigate } from 'react-router-dom'
export const Router = () => {
  // const admin = useSelector(isAdminSelector)
  const isAuth = false
  return (
    <Routes>
      {adminRoutes.map(({ path, element: Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
      {/* <Navigate replace to='/login' /> */}
    </Routes>
  )
}
