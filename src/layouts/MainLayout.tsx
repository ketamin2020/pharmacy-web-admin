import React from 'react'
import Header from 'components/Header/Header'
import Footer from 'components/Footer/Footer'
import styled from '@emotion/styled'
const Wrapper = styled.div`
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;

  & .container {
    width: 100%;
    max-width: 1460px;
    padding-left: 10px;
    padding-right: 10px;
    margin: 0 auto;
  }
  & footer {
    margin-top: auto;
  }
`
const Layout = ({ children }) => {
  return (
    <Wrapper>
      <header>
        <Header />
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </Wrapper>
  )
}

export default Layout
