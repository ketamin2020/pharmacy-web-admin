import React, { useState, useEffect } from 'react'

import styled from '@emotion/styled'

import ReactInputMask from 'react-input-mask'

import { getMain, createMain, updateMain } from 'api/main'

import notification from 'common/Notification/Notification'

import { Form, Input, Select, Button } from 'antd'

const { Option } = Select

const workSchedule = [
  { value: 6, label: '6:00' },
  { value: 7, label: '7:00' },
  { value: 8, label: '8:00' },
  { value: 9, label: '9:00' },
  { value: 10, label: '10:00' },
  { value: 11, label: '11:00' },
  { value: 12, label: '12:00' },
  { value: 13, label: '13:00' },

  { value: 14, label: '14:00' },
  { value: 15, label: '15:00' },
  { value: 16, label: '16:00' },

  { value: 17, label: '17:00' },
  { value: 18, label: '18:00' },
  { value: 19, label: '19:00' },

  { value: 20, label: '20:00' },
  { value: 21, label: '21:00' },
  { value: 22, label: '22:00' },
  { value: 23, label: '23:00' },
]

const initState = {
  name: '',
  link: '',
  phone: '',
  work_schedule: {
    start: 8,
    end: 21,
  },
  support_email: '',
  address: '',
  marketing: {
    phone: '',
    email: '',
  },
  provider: {
    phone: '',
    email: '',
  },
  sales: {
    phone: '',
    email: '',
  },
}
export const Main = () => {
  const [form] = Form.useForm()
  const [formState, setFormState] = useState(initState)

  const handleFormChange = changedFields => {
    setFormState(prevFormState => ({
      ...prevFormState,
      ...changedFields[0],
    }))
  }

  const onCreate = async data => {
    try {
      await createMain(data)
    } catch (error) {
      console.log(error)
    }
  }
  const onUpdate = async data => {
    try {
      await updateMain(data)
      notification('success', 'Company was updated succesfully!')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        if (formState?.id) {
          onUpdate({ ...values, id: formState?.id })
        } else {
          onCreate(values)
        }
      })
      .catch(errorInfo => {
        console.log('Validation Failed:', errorInfo)
      })
  }

  useEffect(() => {
    const fetchMain = async () => {
      try {
        const res = await getMain()
        if (res) {
          form.setFieldsValue(res)
          setFormState(res)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchMain()
  }, [])

  return (
    <Wrapper>
      {' '}
      <Form
        form={form}
        onFieldsChange={handleFormChange}
        initialValues={initState}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item name='name' label='Name'>
          <Input />
        </Form.Item>

        <Form.Item name='link' label='Link'>
          <Input />
        </Form.Item>

        <Form.Item name='phone' label='Phone'>
          <ReactInputMask name='phone' mask='+38(999)-99-99-999' maskChar='X'>
            {inputProps => <Input {...inputProps} placeholder='+38(XXX)-XX-XX-XXX' />}
          </ReactInputMask>
        </Form.Item>

        <Form.Item label='Work Schedule'>
          <Form.Item name={['work_schedule', 'start']} noStyle>
            <Select style={{ marginBottom: '10px' }}>
              {workSchedule.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={['work_schedule', 'end']} noStyle>
            <Select>
              {workSchedule.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item name='support_email' label='Support Email'>
          <Input />
        </Form.Item>
        <Form.Item name='address' label='Address'>
          <Input />
        </Form.Item>

        <Form.Item label='Marketing'>
          <Form.Item name={['marketing', 'email']} noStyle>
            <Input style={{ marginBottom: '10px' }} placeholder='Marketing Email' />
          </Form.Item>
          <Form.Item name={['marketing', 'phone']} noStyle>
            <ReactInputMask name='phone' mask='+38(999)-99-99-999' maskChar='X'>
              {inputProps => <Input {...inputProps} placeholder='+38(XXX)-XX-XX-XXX' />}
            </ReactInputMask>
          </Form.Item>
        </Form.Item>

        <Form.Item label='Provider'>
          <Form.Item name={['provider', 'email']} noStyle>
            <Input style={{ marginBottom: '10px' }} placeholder='Provider Email' />
          </Form.Item>
          <Form.Item name={['provider', 'phone']} noStyle>
            <ReactInputMask name='phone' mask='+38(999)-99-99-999' maskChar='X'>
              {inputProps => <Input {...inputProps} placeholder='+38(XXX)-XX-XX-XXX' />}
            </ReactInputMask>
          </Form.Item>
        </Form.Item>

        <Form.Item label='Sales'>
          <Form.Item name={['sales', 'email']} noStyle>
            <Input style={{ marginBottom: '10px' }} placeholder='Provider Email' />
          </Form.Item>
          <Form.Item name={['sales', 'phone']} noStyle>
            <ReactInputMask name='phone' mask='+38(999)-99-99-999' maskChar='X'>
              {inputProps => <Input {...inputProps} placeholder='+38(XXX)-XX-XX-XXX' />}
            </ReactInputMask>
          </Form.Item>
        </Form.Item>

        <Button onClick={handleSubmit} type='primary'>
          Submit
        </Button>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div``
// const Row = styled.div`
//   display: grid;
//   grid-template-columns: 100px 300px;
//   align-items: center;
//   padding: 10px 0;
// `
// const InnerRow = styled.div`
//   display: flex;
//   gap: 10px;
//   align-items: center;
//   width: 100%;
// `
// const VericalRow = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   align-items: center;
// `
