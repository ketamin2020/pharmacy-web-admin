import React, { ChangeEvent, useEffect, useState } from 'react'
import { Form } from './components/Form'
import { TitleBox } from './components/Title'

import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { RoutesPath } from 'routes/types'

import { useDispatch } from 'react-redux'
import { loginUser } from './authSlice'
import { useAppSelector } from 'store/store'

// import { setToken } from 'store/auth/authSlice'

const inintialState = {
  email: '',
  password: '',
}
const inintialError = {
  email: '',
  password: '',
}

export const Login = () => {
  const { loading, success } = useAppSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [state, setState] = useState(inintialState)
  const [error, setError] = useState(inintialState)

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleValidation = () => {
    const newErrors = {
      email: '',
      password: '',
    }

    if (!state.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(state.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!state.password) {
      newErrors.password = 'Password is required'
    } else if (state.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setError(newErrors)
    return Object.values(newErrors).every(error => error === '')
  }

  const handleSubmit = () => {
    const isValid = handleValidation()

    if (!isValid) {
      console.log('Not Valid')
    }

    try {
      dispatch(loginUser(state))
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setError(inintialError)
    setState(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (success) {
      navigate(redirectTo || RoutesPath.LEADS)
    }
  }, [success])

  return (
    <Wrapper>
      <Form state={state} error={error} handleSubmit={handleSubmit} handleChange={handleChange} loading={loading} />
      <TitleBox />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 350px 350px;
`
