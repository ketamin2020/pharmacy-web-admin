import lazyWithRetry from 'services/lazyWithRetry'
import { Suspense, useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { privateRoute } from './helpers/PrivateRoute'
import { RoutePath } from './types'

export const PrivateRouter = () => {
  const routes = useMemo(
    () => [
      {
        path: RoutePath.DRUGS,
        title: 'Dashboard',
        exact: true,
        element: lazyWithRetry(() => import('../pages/DrugsPage')),
        isAccess: true,
      },
      {
        path: RoutePath.ORDERING,
        title: 'Ordering',
        exact: true,
        element: lazyWithRetry(() => import('../pages/OrderingPage')),
        isAccess: true,
      },
      {
        path: RoutePath.PRICES,
        title: 'Prices',
        exact: true,
        element: lazyWithRetry(() => import('../pages/PricesPage')),
        isAccess: true,
      },
      {
        path: RoutePath.USERS,
        title: 'Users',
        exact: true,
        element: lazyWithRetry(() => import('../pages/UsersPage')),
        isAccess: true,
      },
      {
        path: RoutePath.WORKERS,
        title: 'Workers',
        exact: true,
        element: lazyWithRetry(() => import('../pages/WorkersPage')),
        isAccess: true,
      },
      {
        path: RoutePath.DASHBOARD,
        title: 'Dashboard',
        exact: true,
        element: lazyWithRetry(() => import('../pages/DashboardPage')),
        isAccess: true,
      },
      {
        path: RoutePath.APPLICACTION,
        title: 'Application',
        exact: true,
        element: lazyWithRetry(() => import('../pages/ApplicationPage')),
        isAccess: true,
      },
      {
        path: RoutePath.BRANDS,
        title: 'Brands',
        exact: true,
        element: lazyWithRetry(() => import('../pages/BrandsPage')),
        isAccess: true,
      },
      {
        path: RoutePath.PARTNERS,
        title: 'Partners',
        exact: true,
        element: lazyWithRetry(() => import('../pages/PartnersPage')),
        isAccess: true,
      },
      {
        path: RoutePath.INSTRUCTIONS,
        title: 'Instructions',
        exact: true,
        element: lazyWithRetry(() => import('../pages/InstructionsPage')),
        isAccess: true,
      },
      {
        path: RoutePath.PROPERTIES,
        title: 'Properties',
        exact: true,
        element: lazyWithRetry(() => import('../pages/PropertiesPage')),
        isAccess: true,
      },
      {
        path: RoutePath.IMAGES,
        title: 'Images',
        exact: true,
        element: lazyWithRetry(() => import('../pages/ImagesPage')),
        isAccess: true,
      },
      {
        path: RoutePath.GROUPS,
        title: 'Groups',
        exact: true,
        element: lazyWithRetry(() => import('../pages/GroupsPage')),
        isAccess: true,
      },
      {
        path: RoutePath.SUBSTANCE,
        title: 'Substance',
        exact: true,
        element: lazyWithRetry(() => import('../pages/SubstancePage')),
        isAccess: true,
      },
      {
        path: RoutePath.MAKERS,
        title: 'Makers',
        exact: true,
        element: lazyWithRetry(() => import('../pages/MakersPage')),
        isAccess: true,
      },
      {
        path: RoutePath.ACCOUNTING,
        title: 'Accounting',
        exact: true,
        element: lazyWithRetry(() => import('../pages/AccountingPage')),
        isAccess: true,
      },
    ],
    [window.location.pathname],
  )

  return (
    <Suspense fallback={null}>
      <Routes>
        {routes.map(privateRoute)}
        <Route path='*' element={<Navigate to={RoutePath.DRUGS} />} />
      </Routes>
    </Suspense>
  )
}
