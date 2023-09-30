import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu, theme, Typography, Dropdown } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { RoutePath } from 'routes/types'
import { Avatar } from 'components/Avatar/Avatar'
import type { MenuProps } from 'antd'

import { lastModuleVisited } from 'utils/lastModuleVisited'
import styled from '@emotion/styled'

import { useAppSelector } from 'store/store'
// import { toggleTheme, toggleLoading } from 'store/ui/UISlice'
import { useDispatch } from 'react-redux'
// import { Loader } from 'components/Loader/Loader'
import { logoutUser } from 'features/Login/authSlice'
// import { resetToken } from 'store/auth/authSlice'

const { Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Drugs', RoutePath.DRUGS, <PieChartOutlined />),
  getItem('Ordering', RoutePath.ORDERING, <PieChartOutlined />),
  getItem('Prices', RoutePath.PRICES, <PieChartOutlined />),
  getItem('Users', RoutePath.USERS, <PieChartOutlined />),
  getItem('Workers', RoutePath.WORKERS, <PieChartOutlined />),
  getItem('Dashboard', RoutePath.DASHBOARD, <PieChartOutlined />),
  getItem('Application', RoutePath.APPLICACTION, <PieChartOutlined />),
  getItem('Brands', RoutePath.BRANDS, <PieChartOutlined />),
  getItem('Partners', RoutePath.PARTNERS, <PieChartOutlined />),
  getItem('Instructions', RoutePath.INSTRUCTIONS, <PieChartOutlined />),
  getItem('Properies', RoutePath.PROPERTIES, <PieChartOutlined />),
  getItem('Images', RoutePath.IMAGES, <PieChartOutlined />),
  getItem('Groups', RoutePath.GROUPS, <PieChartOutlined />),
  getItem('Substance', RoutePath.SUBSTANCE, <PieChartOutlined />),
  getItem('Makers', RoutePath.MAKERS, <PieChartOutlined />),
]

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const appTheme = useAppSelector(state => state.ui.theme)
  const loading = useAppSelector(state => state.ui.loading)
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const handleMenuItemClick = (key: RoutesPath) => {
    // dispatch(toggleLoading(true))

    navigate(key)
    lastModuleVisited('set', key)
  }

  const toggleAppTheme = () => {
    // dispatch(toggleTheme())
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate(RoutePath.LOGIN)
  }

  const itemsDropdown: MenuProps['items'] = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Typography.Text onClick={handleLogout}>Logout</Typography.Text>,
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: (
        <Typography.Text onClick={toggleAppTheme}>{appTheme === 'dark' ? 'Light Theme' : 'Dark Theme'}</Typography.Text>
      ),
    },
  ]

  return (
    <Layout hasSider style={{ height: '100vh', display: 'flex' }}>
      <SiderContainer collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)} theme={appTheme}>
        <MenuContainer>
          <div className='demo-logo-vertical' />
          <Menu
            theme={appTheme}
            defaultSelectedKeys={[window.location.pathname]}
            mode='inline'
            items={items}
            onClick={({ key }) => handleMenuItemClick(key)}
          />
        </MenuContainer>

        <Dropdown trigger={['hover']} menu={{ items: itemsDropdown }}>
          <a onClick={e => e.preventDefault()}>
            <AvatarContainer>
              <Avatar color={'#1668dc'}>Max Kovalenko</Avatar>
              {!collapsed && <Typography.Text>Max Kovalenko</Typography.Text>}
            </AvatarContainer>
          </a>
        </Dropdown>
      </SiderContainer>

      <Layout style={{ position: 'relative' }}>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content style={{ margin: '24px 16px 0', overflow: 'scroll' }}>
          <div
            style={{
              padding: 24,
              minHeight: '90vh',
              background: colorBgContainer,
            }}
          >
            {children}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>
          <Typography.Text>Sky CRM ©2023</Typography.Text>
        </Footer> */}
      </Layout>

      {/* <LoaderWrapper loading={loading}>
        <Loader />
      </LoaderWrapper> */}
    </Layout>
  )
}

const SiderContainer = styled(Sider)`
  & .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 94vh;
    justify-content: space-between;
    background-color: ${props => (props.theme === 'dark' ? 'inherit' : 'white')};
  }
`

const MenuContainer = styled.div`
  flex-grow: 1;
`

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
`

// const fadeInAnimation = Keyframes`
//   from {
//     width: 0;
//     height: 0;
//   }
//   to {
//     width: 100vw;
//     height: 100vh;
//   }
// `

// const fadeOutAnimation = Keyframes`
//   from {
//     width: 100vw;
//     height: 100vh;
//   }
//   to {
//     width: 0;
//     height: 0;
//   }
// `
// const LoaderWrapper = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: ${({ loading }) => (loading ? '100vw' : '0')};
//   height: ${({ loading }) => (loading ? '100vh' : '0')};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: #002140;
//   z-index: 100;
//   animation: ${({ loading }) => (loading ? '' : fadeOutAnimation)} 200ms cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
// `
