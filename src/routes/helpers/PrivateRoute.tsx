import { Route, RouteProps } from 'react-router-dom'
import { NotAuthorized } from './NotAuthorized'

interface PrivateRouteProps {
  element: React.LazyExoticComponent<() => JSX.Element>
  isAccess: boolean
  index?: number
}

type ExtendedRouteProps = PrivateRouteProps & RouteProps

export const privateRoute: React.FC<ExtendedRouteProps> = ({
  element,
  isAccess,
  ...route
}): JSX.Element => {
  const Component = element

  return (
    <Route
      key={route.path}
      path={route.path}
      element={!isAccess ? <NotAuthorized path='/' /> : <Component />}
      {...route}
    />
  )
}
