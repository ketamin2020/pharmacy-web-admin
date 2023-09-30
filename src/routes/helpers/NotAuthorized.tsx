import React from 'react'
import { Button, Result,Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography;


export const NotAuthorized = ({ path }: { path: string }) => {
  const navigate = useNavigate()
  return (
    <Result
      status='404'
      title='404'
      subTitle={<Text >Sorry, you are not authorized to access this page.</Text>}
      extra={
        <Button onClick={() => navigate(path)} type='primary'>
          Back Home
        </Button>
      }
    />
  )
}
