import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu, theme, Typography, Dropdown } from 'antd'
import { PieChartOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'
import { RoutePath } from 'routes/types'
import { Avatar } from 'components/Avatar/Avatar'
import type { MenuProps } from 'antd'

import { lastModuleVisited } from 'utils/lastModuleVisited'
import styled from '@emotion/styled'

import { useAppSelector } from 'store/store'
import { toggleTheme } from 'store/ui/UISlice'
import { useDispatch } from 'react-redux'

import { logoutUser } from 'features/Login/authSlice'

const { Content, Sider } = Layout

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
  getItem('Accounting', RoutePath.ACCOUNTING, <PieChartOutlined />),
]

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const appTheme = useAppSelector(state => state.ui.theme)
  const authUser = useAppSelector(state => state.auth.user)
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const handleMenuItemClick = (key: RoutePath) => {
    navigate(key)
    lastModuleVisited('set', key)
  }

  const toggleAppTheme = () => {
    dispatch(toggleTheme())
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
              <Avatar color={'#1668dc'}>{`${authUser?.first_name} ${authUser?.last_name}`}</Avatar>
              {!collapsed && <Typography.Text>{`${authUser?.first_name} ${authUser?.last_name}`}</Typography.Text>}
            </AvatarContainer>
          </a>
        </Dropdown>
      </SiderContainer>

      <Layout style={{ position: 'relative' }}>
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
      </Layout>
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
