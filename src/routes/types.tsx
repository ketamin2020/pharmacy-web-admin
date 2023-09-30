import { LazyExoticComponent } from 'react'

enum RoutePath {
  HOME_PAGE = '/',
  LOGIN = '/login',
  DRUGS = '/drugs',
  INSTRUCTIONS = '/instructions',
  PROPERTIES = '/properties',
  IMAGES = '/images',
  GROUPS = '/groups',
  SUBSTANCE = '/substance',
  MAKERS = '/makers',
  ORDERING = '/ordering',
  BRANDS = '/brands',
  PARTNERS = '/partners',
  USERS = '/users',
  DASHBOARD = '/dashboard',
  WORKERS = '/workers',
  APPLICACTION = '/application',
  PRICES = '/prices',
}

interface Routes {
  name: string
  path: string
  exact: boolean
  element: LazyExoticComponent<() => JSX.Element>
}

export { Routes, RoutePath }
