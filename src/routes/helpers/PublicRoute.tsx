import { Route, RouteProps } from 'react-router-dom'

interface PrivateRouteProps {
  element: React.LazyExoticComponent<() => JSX.Element>
  isAccess: boolean
  index?: number
}

type ExtendedRouteProps = PrivateRouteProps & RouteProps

export const publicRoute: React.FC<ExtendedRouteProps> = ({
  element,
  ...route
}): JSX.Element => {
  const Component = element

  return (
    <Route
      key={route.path}
      path={route.path}
      element={<Component />}
      {...route}
    />
  )
}
