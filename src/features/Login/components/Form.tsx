import { Button, Typography, Input, Spin } from 'antd'

import React, { ChangeEvent } from 'react'

import styled from '@emotion/styled'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

interface IProps {
  state: { email: string; password: string; remember: boolean }
  error: { email: string; password: string }
  handleSubmit: () => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  loading: boolean
}

export const Form: React.FC<IProps> = ({ state, error, handleSubmit, handleChange, loading }) => {
  return (
    <Wrapper>
      <Box>
        <Typography.Title
          style={{
            width: '70px',
            height: '70px',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px green`,
            fontSize: '18px',
          }}
        >
          Artmed
        </Typography.Title>

        <Typography.Text style={{ color: 'white', marginBottom: '30px' }}>Sign in to Artmed</Typography.Text>

        <ControlsWrapper>
          <InputBox>
            <Typography.Text style={{ color: 'white', padding: '4px', fontSize: '12px' }}>Email</Typography.Text>
            <Input
              style={{ height: '40px', padding: '4px 4px 4px 10px' }}
              type='email'
              name='email'
              onChange={handleChange}
              className='email-input'
              placeholder='Enter your login...'
              status={!!error?.email && 'error'}
              value={state.email}
            />
            {!!error?.email && <ErrorMessage>{error.email}</ErrorMessage>}
          </InputBox>
          <InputBox>
            <Typography.Text style={{ color: 'white', padding: '4px', fontSize: '12px' }}>Password</Typography.Text>
            <Input.Password
              name='password'
              onChange={handleChange}
              placeholder='Enter your password...'
              status={!!error?.password && 'error'}
              value={state.password}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            {!!error?.password && <ErrorMessage>{error.password}</ErrorMessage>}
          </InputBox>
        </ControlsWrapper>

        {loading ? (
          <Spin />
        ) : (
          <Button
            onClick={handleSubmit}
            style={{
              width: '100%',
              height: '30px',
              boxShadow: `0 0 20px green`,
              backgroundColor: '#118559',
              outline: 'none',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            <Typography.Text style={{ color: 'white' }}>Login</Typography.Text>
          </Button>
        )}
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  min-height: 550px;
  width: 100%;
  box-shadow: 15px 2px 5px -5px;
  background-color: rgba(0, 24, 57, 0.2);
  border-radius: 30px 0px 0px 30px;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-height: 550px;
  padding: 20px;
`

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  margin-bottom: 20px;
  & input {
    height: 32px;
    background-color: #201d2c !important;
    color: white;
  }
`
const InputBox = styled.div`
  & .ant-input-affix-wrapper {
    background-color: #201d2c !important;
    color: white;
  }
  & .email-input {
    &::placeholder {
      font-size: 14px;
    }
  }
`
const ErrorMessage = styled(Typography.Text)`
  font-size: 12px;
  color: red;
`
