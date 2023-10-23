import { useState, useEffect } from 'react'
import { Button, Select } from 'antd'

import styled from '@emotion/styled'

import { FilterDropdownProps } from 'antd/lib/table/interface'

import moment from 'moment-timezone'

import DatePicker from 'components/DatePicker/DatePicker'

const { RangePicker, MonthPicker, YearPicker } = DatePicker

const { Option } = Select

const yearFormat = 'YYYY'
const dateFormat = 'DD/MM/YYYY'
const monthFormat = 'MMM, YYYY'

type Label =
  | '1 month'
  | '1 day'
  | 'Month to date'
  | 'Custom'
  | '6 month'
  | '3 month'
  | '1 year'
  | 'Month to date'
  | 'Custom'
type Type = 'range' | 'month' | 'year' | 'day'

export interface IPeriod {
  label: Label
  start_date: Moment | string
  end_date: Moment | string
  type: Type
}

const defaultData: IPeriod = {
  label: 'Month to date',
  start_date: moment().startOf('month').format(dateFormat),
  end_date: moment().format(dateFormat),
  type: 'range',
}

const date: IPeriod[] = [
  {
    label: '1 day',
    start_date: moment().format(dateFormat),
    end_date: moment().format(dateFormat),
    type: 'day',
  },
  {
    label: '1 week',
    start_date: moment()
      .day(moment().day() - 6)
      .format(dateFormat),
    end_date: moment().format(dateFormat),
    type: 'range',
  },
  {
    label: 'Month to date',
    start_date: moment().startOf('month').format(dateFormat),
    end_date: moment().format(dateFormat),
    type: 'range',
  },
  {
    label: '1 month',
    start_date: moment().startOf('month').format(dateFormat),
    end_date: moment().format(dateFormat),
    type: 'month',
  },
  {
    label: '3 month',
    start_date: moment()
      .month(moment().month() - 3)
      .format(dateFormat),
    end_date: moment().format(dateFormat),
    type: 'range',
  },
  {
    label: '6 month',
    start_date: moment()
      .month(moment().month() - 6)
      .format(dateFormat),
    end_date: moment().format(dateFormat),
    type: 'range',
  },
  {
    label: 'Year to date',
    start_date: moment().startOf('year').format(dateFormat),
    end_date: moment().format(dateFormat),
    type: 'range',
  },
  {
    label: '1 year',
    start_date: moment().startOf('year').format(dateFormat),
    end_date: moment().endOf('year').format(dateFormat),
    type: 'year',
  },
  {
    label: 'Custom',
    start_date: moment()
      .day(moment().day() - 6)
      .format(dateFormat),
    end_date: moment().format(dateFormat),
    type: 'range',
  },
]

export const DateRangeFilter = (props: FilterDropdownProps) => {
  const [period, setPeriod] = useState<IPeriod>(defaultData)

  const heandleChangePicker = (data: IPeriod, dataArrString: [string, string]) => {
    console.log(data, 'data')
    props.setSelectedKeys(dataArrString)
    setPeriod(data)
  }

  const heandleSubmit = () => {
    props.confirm?.()
  }
  const handleReset = () => {
    setPeriod(defaultData)
    props.clearFilters?.()
    props.confirm?.()
  }

  useEffect(() => {
    if (props.visible) {
      setPeriod(defaultData)
      props.setSelectedKeys([`${defaultData.start_date}|${defaultData.end_date}`])
    }
  }, [props.visible])

  return (
    <Wrapper>
      <InputWrapper>
        <Select
          style={{ width: '100%' }}
          value={period.label}
          name='select'
          size='small'
          onChange={(value, { item }) => heandleChangePicker(item, [`${item.start_date}|${item.end_date}`])}
        >
          {date.map((item, idx) => (
            <Option
              className='select-item'
              key={idx}
              item={item}
              start_date={item.start_date}
              end_date={item.end_date}
              value={item.label}
            >
              {item.label}
            </Option>
          ))}
        </Select>
      </InputWrapper>

      {period.type === 'day' && (
        <DatePicker
          value={period?.start_date ? moment(period?.start_date, dateFormat) : moment()}
          onChange={(date, string) => {
            heandleChangePicker(
              {
                start_date: date ? moment(date).format(dateFormat) : '',
                end_date: date ? moment(date).format(dateFormat) : '',
                type: period.type,
                label: period.label,
              },
              [string],
            )
          }}
          format={dateFormat}
          allowClear={false}
        />
      )}
      {period.type === 'month' && (
        <MonthPicker
          defaultValue={moment()}
          value={period?.start_date ? moment(period?.start_date, dateFormat) : undefined}
          onChange={date =>
            heandleChangePicker(
              {
                start_date: date ? moment(date).startOf('month').format(dateFormat) : '',
                end_date: date ? moment(date).endOf('month').format(dateFormat) : '',
                type: period.type,
                label: period.label,
              },
              [
                date
                  ? `${moment(date).startOf('month').format(dateFormat)}|${moment(date)
                      .endOf('month')
                      .format(dateFormat)}`
                  : '',
              ],
            )
          }
          format={monthFormat}
          allowClear={false}
        />
      )}
      {period.type === 'year' && (
        <YearPicker
          defaultValue={period?.start_date ? moment(period?.start_date, yearFormat) : undefined}
          onChange={(date, string) => {
            heandleChangePicker(
              {
                start_date: date ? moment(date).startOf('year').format(dateFormat) : '',
                end_date: date ? moment(date).endOf('year').format(dateFormat) : '',
                type: period.type,
                label: period.label,
              },
              [
                date
                  ? `${moment(date).startOf('year').format(dateFormat)}|${moment(date)
                      .endOf('year')
                      .format(dateFormat)}`
                  : '',
              ],
            )
          }}
          value={period?.start_date ? moment(period?.start_date as dayjs.ConfigType) : undefined}
          format={yearFormat}
          allowClear={false}
        />
      )}
      {period.type === 'range' && (
        <RangePicker
          value={[
            period?.start_date ? moment(period?.start_date, dateFormat) : undefined,
            period?.end_date ? moment(period?.end_date, dateFormat) : undefined,
          ]}
          onChange={(date, string) =>
            heandleChangePicker(
              {
                start_date: string[0] || '',
                end_date: string[1] || '',
                type: period.type,
                label: period.label,
              },
              [`${string[0] || ''}|${string[1] || ''}`],
            )
          }
          format={dateFormat}
          allowClear={false}
        />
      )}

      <ButtonWrapper>
        <Button onClick={handleReset}>Close</Button>
        <Button onClick={heandleSubmit}>Ok</Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 10px;
  min-width: 250px;
  & .ant-picker {
    width: 100%;
  }
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
`

const InputWrapper = styled.div`
  margin-bottom: 10px;
`
