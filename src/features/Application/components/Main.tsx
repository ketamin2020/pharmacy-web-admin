import React, { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import styled from '@emotion/styled'
import { Divider } from '@material-ui/core'
import ReactInputMask from 'react-input-mask'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { getMain, createMain, updateMain } from 'api/main'
import Button from '@mui/material/Button'
import notification from 'common/Notification/Notification'
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
  const [state, setState] = useState(initState)
  const onChange = e => {
    const { name, value } = e.target
    setState(prev => ({ ...prev, [name]: value }))
  }
  const onChangeContacts = (key, e) => {
    const { name, value } = e.target
    setState(prev => ({
      ...prev,
      [key]: {
        ...prev?.[key],
        [name]: value,
      },
    }))
  }
  const onChangeWorkShedule = e => {
    const { name, value } = e.target
    setState(prev => ({
      ...prev,
      work_schedule: {
        ...prev.work_schedule,
        [name]: value,
      },
    }))
  }

  const onCreate = async () => {
    try {
      await createMain(state)
    } catch (error) {
      console.log(error)
    }
  }
  const onUpdate = async () => {
    try {
      await updateMain(state)
      notification('success', 'Company was updated succesfully!')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchMain = async () => {
      try {
        const res = await getMain()
        if (res) setState({ ...res, id: res._id })
      } catch (error) {
        console.log(error)
      }
    }
    fetchMain()
  }, [])
  return (
    <Wrapper>
      <Row>
        <p>Label:</p>
        <TextField fullWidth size='small' label='Name' name='name' value={state.name} onChange={onChange} />
      </Row>
      <Divider />
      <Row>
        <p>Link:</p>
        <TextField fullWidth size='small' label='Link' name='link' value={state.link} onChange={onChange} />
      </Row>
      <Divider />
      <Row>
        <p>Phone:</p>
        <ReactInputMask name='phone' mask={'+38(999)-99-99-999'} maskChar='X' value={state.phone} onChange={onChange}>
          {inputProps => (
            <TextField size='small' variant='outlined' fullWidth label='Phone' {...inputProps} type='tel' />
          )}
        </ReactInputMask>
      </Row>
      <Divider />
      <Row>
        <p>Work schedule:</p>
        <InnerRow>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={state.work_schedule.start}
            label='Start work'
            placeholder='Start work'
            onChange={onChangeWorkShedule}
            size='small'
            name='start'
          >
            {workSchedule.map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={state.work_schedule.end}
            label='End work'
            placeholder='End work'
            onChange={onChangeWorkShedule}
            size='small'
            name='end'
          >
            {workSchedule.map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </InnerRow>
      </Row>
      <Divider />
      <Row>
        <p>Support email:</p>
        <TextField
          fullWidth
          size='small'
          label='Support email'
          placeholder='example@gmail.com'
          name='support_email'
          value={state.support_email}
          onChange={onChange}
          type='email'
        />
      </Row>
      <Divider />
      <Row>
        <p>Address:</p>
        <TextField
          fullWidth
          size='small'
          label='Address'
          placeholder='Address'
          name='address'
          value={state.address}
          onChange={onChange}
          type='text'
        />
      </Row>
      <Divider />
      <Row>
        <p>Marketing:</p>
        <VericalRow>
          <TextField
            fullWidth
            size='small'
            label='Email'
            placeholder='example@gmail.com'
            name='email'
            value={state.marketing.email}
            onChange={e => onChangeContacts('marketing', e)}
            type='email'
          />
          <ReactInputMask
            name='phone'
            mask={'+38(999)-99-99-999'}
            maskChar='X'
            value={state.marketing.phone}
            onChange={e => onChangeContacts('marketing', e)}
          >
            {inputProps => (
              <TextField size='small' variant='outlined' fullWidth label='Phone' {...inputProps} type='tel' />
            )}
          </ReactInputMask>
        </VericalRow>
      </Row>
      <Divider />
      <Row>
        <p>Provider:</p>
        <VericalRow>
          <TextField
            fullWidth
            size='small'
            label='Email'
            placeholder='example@gmail.com'
            name='email'
            value={state.provider.email}
            onChange={e => onChangeContacts('provider', e)}
            type='email'
          />
          <ReactInputMask
            name='phone'
            mask={'+38(999)-99-99-999'}
            maskChar='X'
            value={state.provider.phone}
            onChange={e => onChangeContacts('provider', e)}
          >
            {inputProps => (
              <TextField size='small' variant='outlined' fullWidth label='Phone' {...inputProps} type='tel' />
            )}
          </ReactInputMask>
        </VericalRow>
      </Row>
      <Divider />
      <Row>
        <p>Sales:</p>
        <VericalRow>
          <TextField
            fullWidth
            size='small'
            label='Email'
            placeholder='example@gmail.com'
            name='email'
            value={state.sales.email}
            onChange={e => onChangeContacts('sales', e)}
            type='email'
          />
          <ReactInputMask
            name='phone'
            mask={'+38(999)-99-99-999'}
            maskChar='X'
            value={state.sales.phone}
            onChange={e => onChangeContacts('sales', e)}
          >
            {inputProps => (
              <TextField size='small' variant='outlined' fullWidth label='Phone' {...inputProps} type='tel' />
            )}
          </ReactInputMask>
        </VericalRow>
      </Row>
      <Divider />
      <Button onClick={state?.id ? onUpdate : onCreate} style={{ margin: '10px' }} size='medium' variant='outlined'>
        {state?.id ? 'Update' : 'Create'}
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div``
const Row = styled.div`
  display: grid;
  grid-template-columns: 100px 300px;
  align-items: center;
  padding: 10px 0;
`
const InnerRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
`
const VericalRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`
