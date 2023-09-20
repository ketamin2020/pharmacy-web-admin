import React from 'react'

import bg from '../images/bg.png'
import styled from '@emotion/styled'

export const AuthLayout = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return <AuthWrapper>{children}</AuthWrapper>
}
const AuthWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${bg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`
