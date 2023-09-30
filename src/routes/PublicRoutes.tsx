import React, { useMemo, Suspense } from 'react'
import { Routes, Navigate, Route } from 'react-router-dom'
import { publicRoute } from './helpers/PublicRoute'

import { RoutePath } from './types'

import lazyWithRetry from 'services/lazyWithRetry'

export const PublicRouter = () => {
  const routes = useMemo(
    () => [
      {
        label: 'Login',
        path: RoutePath.LOGIN,
        element: lazyWithRetry(() => import('../pages/LoginPage/LoginPage')),
        isAccess: true,
      },
    ],
    [window.location.hostname],
  )

  return (
    <Suspense fallback={null}>
      <Routes>
        {routes.map(publicRoute)}
        <Route path='*' element={<Navigate to={RoutePath.LOGIN} />} />
      </Routes>
    </Suspense>
  )
}
