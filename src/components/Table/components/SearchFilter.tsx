import { Button, Tag, Input } from 'antd'
import { useState, FC, ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react'
import { FilterDropdownProps } from 'antd/lib/table/interface'
import { SearchOutlined } from '@ant-design/icons'

import styled from '@emotion/styled'

interface IFilterProps extends FilterDropdownProps {
  title: string
}

const errorMsg = {
  dublicate: 'This value is dublicate.',
}

export const SearchFilter: FC<IFilterProps> = ({
  title,
  clearFilters,
  confirm,
  selectedKeys,
  setSelectedKeys,
  visible,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>('')
  const [value, setValue] = useState('')
  useEffect(() => {
    if (!visible) setValue('')
  }, [visible])

  const handleSearch = () => {
    if (value?.trim()) {
      setSelectedKeys([...selectedKeys, value])
      setValue('')
    }
    confirm?.()
  }
  const handleReset = () => {
    clearFilters?.()
    confirm?.()
    setError('')
  }

  const onChangeInputHeandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (selectedKeys?.includes(value)) {
      return setError(errorMsg.dublicate)
    }
    setValue(value)
    setError('')
  }

  const onKeyDownHeandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!value?.trim() || selectedKeys?.includes(value.trim())) return
      setSelectedKeys([...selectedKeys, value])
      setValue('')
    }
  }

  return (
    <Wrapper>
      <Input
        ref={inputRef}
        placeholder={`${typeof title === 'function' ? 'Search' : `Search by ${title}`}`}
        helperText={!error && 'Press Enter to add filter value'}
        onChange={onChangeInputHeandler}
        error={!!error}
        onKeyDown={onKeyDownHeandler}
        value={value}
      />
      {!!error && <div className='label'>{error}</div>}
      {!!selectedKeys?.length && (
        <div className='filter-values'>
          <p>Filtered values: </p>
          {selectedKeys?.map(key => (
            <Tag
              color='#108ee9'
              closable
              className='atn-tag'
              onClose={() => {
                setSelectedKeys(selectedKeys?.filter(filteredKey => filteredKey !== key))
              }}
              key={key}
            >
              {key}
            </Tag>
          ))}
        </div>
      )}
      <hr />
      <div className='filter-buttons'>
        <Button type='primary' onClick={handleSearch} icon={<SearchOutlined />} size='small' style={{ width: 90 }}>
          Search
        </Button>
        <Button onClick={handleReset} size='small' style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 10px;
  max-width: 316px;
  min-width: 200px;

  .table-date-picker {
    width: 100%;
  }
  .filter-buttons {
    margin: 10px 0 0;
    display: flex;
    justify-content: space-between;
  }
  .label {
    color: red;
    text-align: center;
  }

  .filter-values {
    margin: 10px 0 20px;

    & > p {
      font-weight: 600;
    }

    .atn-tag {
      display: inline-flex;
      align-items: center;
      margin-bottom: 3px !important;
      & span {
        margin-top: 1px;
      }
    }
  }

  hr {
    margin-bottom: 0;
  }
`
