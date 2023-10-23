import React from 'react'

import { Tabs, TabsProps } from 'antd'

import styled from '@emotion/styled'

import { Banner } from './components/Banner'
import { Main } from './components/Main'

const Wrapper = styled.section``

export const Application = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Main Info',
      children: <Main />,
    },
    {
      key: '2',
      label: 'Banners',
      children: <Banner />,
    },
  ]
  return (
    <Wrapper>
      <Tabs defaultActiveKey='1' items={items} />
    </Wrapper>
  )
}
