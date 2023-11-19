import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'

import { Add } from '@mui/icons-material'

import { getProperties, deleteProperty, updateProperty, createProperty } from 'api/property'
import { getTradeNames, deleteTradeName, updateTradeName, createTradeName } from 'api/tradeName'
import { getForms } from 'api/form'
import { getSubstances } from 'api/substances'
import { getMakers } from 'api/makers'
import { getDosage } from 'api/dosage'
import { getRoutes } from 'api/administrationRoute'
import { getQuantity } from 'api/quantity'
import { getTemperatures } from 'api/temperature'
import { getPackages } from 'api/package'
import notification from 'common/Notification/Notification'
import { getGroups } from 'api/groups'

import styled from '@emotion/styled'
import { CreateSubstanceModal } from 'components/modals/CreateSubstanceModal'
import { CreateTradeNameModal } from 'components/modals/CreateTradeNameModal'
import { CreateMakerModal } from 'components/modals/CreateMakerModal'
import { CreateFormModal } from 'components/modals/CreateFormModal'
import { CreateRouteModal } from 'components/modals/CreateRouteModal'
import { CreateDosageModal } from 'components/modals/CreateDosageModal'
import { CreateQuantityModal } from 'components/modals/CreateQuantityModal'
import { CreateTemperatureModal } from 'components/modals/CreateTemperatureModal'
import { CreatePackageModal } from 'components/modals/CreatePackageModal'

import { Table } from 'components/Table/Table'

import { PaginationConfig } from 'antd/lib/pagination'

import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface'

import { ColumnProps } from 'antd/lib/table'
import moment from 'moment'

import { SearchFilter } from 'components/Table/components/SearchFilter'
import { DateRangeFilter } from 'components/Table/components/DateRangeFilter'
import { TableActions } from 'components/TableActions/TableActions'
import { Modal, Input, Button, Tooltip, Select } from 'antd'

const renderTitle = name => (
  <Tooltip placement='topLeft' title={name}>
    {name}
  </Tooltip>
)

interface Film {
  title: string
  year: number
}

const warningsItems = [
  { value: 'Можна', name: 'Можна' },
  { value: 'З обережністю', name: 'З обережністю' },
  { value: 'Заборонено', name: 'Заборонено' },
]

const childItems = [
  { name: 'Заборонено', value: 'Заборонено' },
  { name: 'Дозволено', value: 'Дозволено' },
  { value: 'З обережністю', name: 'З обережністю' },
  { name: 'З 1 року', value: 'З 1 року' },
  { name: 'З 2 років', value: 'З 2 років' },
  { name: 'З 3 років', value: 'З 3 років' },
  { name: 'З 4 років', value: 'З 4 років' },
  { name: 'З 5 років', value: 'З 5 років' },
  { name: 'З 6 років', value: 'З 6 років' },
  { name: 'З 7 років', value: 'З 7 років' },
  { name: 'З 8 років', value: 'З 8 років' },
  { name: 'З 9 років', value: 'З 9 років' },
  { name: 'З 10 років', value: 'З 10 років' },
  { name: 'З 11 років', value: 'З 11 років' },
  { name: 'З 12 років', value: 'З 12 років' },
  { name: 'З 13 років', value: 'З 13 років' },
  { name: 'З 14 років', value: 'З 14 років' },
  { name: 'З 15 років', value: 'З 15 років' },
  { name: 'З 16 років', value: 'З 16 років' },
  { name: 'З 17 років', value: 'З 17 років' },
  { name: 'З 18 років', value: 'З 18 років' },
]

const initData = {
  active_ingredient: {
    value: '',
  },
  marked_name: {
    value: '',
  },
  groups: {
    main_group: {
      value: '',
      slug: '',
    },
    first_lavel_group: {
      value: '',
      slug: '',
    },
    second_lavel_group: {
      value: '',
      slug: '',
    },
  },

  manufacturing_country: {
    value: '',
  },
  maker: {
    value: '',
  },
  imported: {
    value: 'Так',
  },
  dosage: {
    value: '',
  },
  production_form: {
    value: '',
  },
  prescription: {
    value: 'Так',
  },
  morion: {
    value: '',
  },
  administration_route: {
    value: '',
  },
  quantity: {
    value: '',
  },

  expiration: {
    value: '',
  },
  atc: {
    value: '',
  },
  storage_temperature: {
    value: '',
  },

  package: {
    value: '',
  },
}

const initWarnings = {
  allergy_warning: {
    value: '',
  },
  diabetes_warning: {
    value: '',
  },
  driving_warning: {
    value: '',
  },
  pregnancy_warning: {
    value: '',
  },
  breastfeeding_warning: {
    value: '',
  },
  alcohol_warning: {
    value: '',
  },
  child_warning: {
    value: '',
  },
}

export const Property = () => {
  const [state, setState] = useState(initData)
  const [warnings, setWarnings] = useState(initWarnings)

  const [data, setData] = useState([])

  const [selected, setSelected] = useState<readonly string[]>([])

  const [open, setOpen] = useState(false)
  const [rowSelected, setRowSelected] = useState({})
  const [code, setCode] = useState()
  const [name, setName] = useState()
  const [externalCode, setExternalCode] = useState()
  const [makers, setMakers] = useState([])
  const [forms, setForms] = useState([])
  const [tradeNames, setTradeNames] = useState([])
  const [route, setRoute] = useState([])
  const [dosage, setDosage] = useState([])
  const [quantity, setQuantity] = useState([])
  const [temperature, setTemperature] = useState([])
  const [packages, setPackages] = useState([])
  const [options, setOptions] = useState<readonly Film[]>([])
  const [groups, setGroups] = useState([])
  const [openTradeNameModal, setOpenTradeNameModal] = useState(false)
  const [percentType, setPercentType] = useState(1)
  const [propertyType, setPropertyType] = useState(1)

  const [openSubstaceModal, setOpenSubstaceModal] = useState(false)
  const [openMakerModal, setOpenMakerModal] = useState(false)
  const [openFormModal, setOpenFormModal] = useState(false)
  const [openRouteModal, setOpenRouteModal] = useState(false)
  const [openDosageModal, setOpenDosageModal] = useState(false)
  const [openQuantityModal, setOpenQuantityModal] = useState(false)
  const [openTemperatureModal, setOpenTemperatureModal] = useState(false)
  const [openPackageModal, setOpenPackageModal] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 25,
    total: 10,
  })

  const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null)

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setState(prev => ({ ...prev, [name]: { ...prev[name], value: value } }))
  }

  const onChangeWarnings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setWarnings(prev => ({ ...prev, [name]: { ...prev[name], value: value } }))
  }
  const onChangeGroups = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, slug } = e.target
    setState(prev => ({
      ...prev,
      ['groups']: {
        ...prev['groups'],
        [name]: {
          value,
          slug,
        },
      },
    }))
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setState(initData)

    setCode(null)
    setName('')
    setExternalCode('')
    setRowSelected('')
    setSelected([])
  }

  const fetchPropertiesList = async params => {
    try {
      const { data, meta } = await getProperties(params)
      setPagination({
        page: meta.current,
        page_size: meta.pageSize,
        total: meta.total,
      })
      setData(data)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  const handleCreate = async () => {
    try {
      await createProperty({
        main: state,
        warnings,
        morion: code,
        name,
        external_code: externalCode,
      })
      setSelected([])
      setRowSelected({})
      await fetchPropertiesList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Property was created successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleUpdate = async () => {
    try {
      await updateProperty({
        id: rowSelected.id,
        main: state,
        warnings: warnings,
        name,
        external_code: externalCode,
        morion: code,
      })
      setSelected([])
      setRowSelected({})
      await fetchPropertiesList({ page: pagination.page, per_page: pagination.per_page })
      notification('success', 'Property was updated successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteProperty(rowSelected.id)
      await fetchPropertiesList({ page: pagination.page, per_page: pagination.per_page })
      setSelected([])
      setRowSelected({})
      notification('success', 'Property was deleted successfuly!')
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  const fetchSubstanceList = async () => {
    try {
      const { data } = await getSubstances()

      setOptions(data)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchMakersList = async () => {
    try {
      const { data } = await getMakers()

      setMakers(data)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchTradeNamesList = async () => {
    try {
      const res = await getTradeNames()

      setTradeNames(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchFormsList = async () => {
    try {
      const res = await getForms()

      setForms(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchRoutesList = async () => {
    try {
      const res = await getRoutes()

      setRoute(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchDosageList = async () => {
    try {
      const res = await getDosage()

      setDosage(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchQuantityList = async () => {
    try {
      const res = await getQuantity()

      setQuantity(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchTemperatureList = async () => {
    try {
      const res = await getTemperatures()

      setTemperature(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchPackagesList = async () => {
    try {
      const res = await getPackages()

      setPackages(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }
  const fetchGroupsList = async () => {
    try {
      const res = await getGroups()

      setGroups(res)
    } catch (error) {
      notification('error', 'Something went wrong!')
    }
  }

  useEffect(() => {
    fetchPropertiesList({ page: pagination.page, per_page: pagination.per_page })
  }, [])
  useEffect(() => {
    fetchSubstanceList()
  }, [])
  useEffect(() => {
    fetchMakersList()
  }, [])
  useEffect(() => {
    fetchTradeNamesList()
  }, [])
  useEffect(() => {
    fetchFormsList()
  }, [])
  useEffect(() => {
    fetchRoutesList()
  }, [])
  useEffect(() => {
    fetchDosageList()
  }, [])
  useEffect(() => {
    fetchQuantityList()
  }, [])
  useEffect(() => {
    fetchTemperatureList()
  }, [])
  useEffect(() => {
    fetchPackagesList()
  }, [])
  useEffect(() => {
    fetchGroupsList()
  }, [])

  const handleTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof object, string[]>>,
    sorter: SorterResult<object>,
  ) => {
    fetchPropertiesList({
      page: pagination.current,
      sort_field: sorter.order ? sorter.field : null,
      order: sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null,
      per_page: pagination.pageSize,
      ...filters,
    })
  }

  const onRow = (record: any, rowIndex: number) => ({
    onClick: () => {
      setClickedRowIndex(rowIndex)
    },
  })
  const tableActionProps = record => ({
    todos: ['delete', 'edit'],
    callbacks: [
      () => handleDelete(record.id),
      () => {
        setState(record.attributes.main.items)
        setWarnings(record.attributes.warnings.items)
        setRowSelected(record)
        setExternalCode(record.external_code)
        setCode(record.code)
        setName(record.name)

        setOpen(true)
      },
    ],
    preloaders: [],
    disabled: [false, false],
    tooltips: ['Remove this property?', 'Edit this property?'],
    popConfirms: ['Are you sure that you want to delete this property?'],
  })

  const columns: ColumnProps<any> = useMemo(
    () => [
      {
        title: renderTitle('Name'),
        dataIndex: 'name',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 400,
      },

      {
        title: renderTitle('External Code'),
        dataIndex: 'external_code',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Morion'),
        dataIndex: 'morion',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Slug'),
        dataIndex: 'slug',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Sold'),
        dataIndex: 'sold',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },
      {
        title: renderTitle('Views'),
        dataIndex: 'views',
        sorter: true,
        filterDropdown: (props: FilterDropdownProps) => <SearchFilter title={'Search'} {...props} />,
        width: 200,
      },

      {
        title: renderTitle('Created at'),
        dataIndex: 'created_at',
        sorter: true,
        width: 200,

        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
      },
      {
        title: renderTitle('Updated at'),
        dataIndex: 'updated_at',
        sorter: true,
        width: 200,

        render: value => moment(value).format('DD/MM/YYYY HH:mm'),
        filterDropdown: (props: FilterDropdownProps) => <DateRangeFilter {...props} />,
      },
      {
        title: renderTitle('Actions'),
        dataIndex: 'actions',
        sorter: false,
        width: 200,
        render: (value, record) => <TableActions {...tableActionProps(record)} />,
      },
    ],
    [clickedRowIndex],
  )

  const firstLavelGroup =
    state?.groups?.main_group?.value && groups?.find(g => g.id === state?.groups?.main_group?.value)?.children
  const secondLavelGroup =
    firstLavelGroup && firstLavelGroup?.find(g => g.id === state?.groups?.first_lavel_group?.value)?.children

  return (
    <Box sx={{ width: '100%' }}>
      <Button style={{ marginBottom: '10px' }} onClick={handleClickOpen}>
        {' '}
        Add new Property{' '}
      </Button>
      <Table columns={columns} dataSource={data} pagination={pagination} onChange={handleTableChange} onRow={onRow} />

      <Modal
        onOk={
          rowSelected?.id
            ? () => {
                handleUpdate()
                handleClose()
              }
            : () => {
                handleCreate()
                handleClose()
              }
        }
        open={open}
        okText={rowSelected?.id ? 'Update' : 'Create'}
        onCancel={handleClose}
        title='Property'
        width={800}
      >
        <Wrapper>
          <Row>
            <p>Код Моріон</p>
            <Input placeholder='Morion' required type='number' onChange={e => setCode(e.target.value)} value={code} />
          </Row>
          <Row>
            <p>Зовнішній код</p>
            <Input
              placeholder='External code'
              type='text'
              onChange={e => setExternalCode(e.target.value)}
              value={externalCode}
            />
          </Row>

          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>Percent Type</p>
            <Select
              onChange={setPercentType}
              placeholder='Percent Type'
              value={percentType}
              options={[
                { label: 'Нац. перелік з регульованою націнкою', value: 1 },
                { label: 'ЛЗ з нерегульованою націнкою', value: 2 },
                { label: 'Іншні товари з нерегульованою націнкою', value: 3 },
                { label: 'РРЦ', value: 4 },
              ]}
            />
          </Row>
          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>Property Type</p>
            <Select
              onChange={setPropertyType}
              placeholder='Property Type'
              value={propertyType}
              options={[
                { label: 'ЛЗ', value: 1 },
                { label: 'БАДи', value: 2 },
                { label: 'Товари', value: 3 },
                { label: 'Інше', value: 4 },
              ]}
            />
          </Row>

          <Row>
            <p>Назва</p>
            <Input placeholder='Name' required type='text' onChange={e => setName(e.target.value)} value={name} />
          </Row>

          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>Основна група</p>
            <Select
              onChange={value =>
                onChangeGroups({
                  target: {
                    name: 'main_group',
                    value,
                    slug: groups.find(f => f.id === value)?.slug,
                  },
                })
              }
              placeholder='Main Group'
              value={state?.groups?.main_group?.value || null}
              options={groups.map(item => ({ value: item.id, label: item.group_name }))}
            />
          </Row>
          {!!state?.groups?.main_group?.value && (
            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>1-ша підгрупа</p>
              <Select
                onChange={value =>
                  onChangeGroups({
                    target: {
                      name: 'first_lavel_group',
                      value,
                      slug: firstLavelGroup.find(f => f.id === value)?.slug,
                    },
                  })
                }
                value={state?.groups?.first_lavel_group?.value || null}
                placeholder='First Group'
                options={firstLavelGroup?.map(item => ({ value: item.id, label: item.group_name }))}
              />
            </Row>
          )}
          {!!state?.groups?.first_lavel_group?.value && (
            <Row>
              <p style={{ display: 'flex', gap: '10px' }}>2-ша підгрупа</p>

              <Select
                onChange={value =>
                  onChangeGroups({
                    target: {
                      name: 'second_lavel_group',
                      value,
                      slug: secondLavelGroup.find(f => f.id === value)?.slug,
                    },
                  })
                }
                value={state?.groups?.second_lavel_group?.value || null}
                placeholder='Second Group'
                options={secondLavelGroup?.map(item => ({ value: item.id, label: item.group_name }))}
              />
            </Row>
          )}

          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>
              Діюча речовина{' '}
              <span style={{ cursor: 'pointer' }} onClick={() => setOpenSubstaceModal(true)}>
                <Add />
              </span>
            </p>
            <Select
              placeholder='Substance'
              options={options?.map(item => ({ value: item.id, label: item.name_ua }))}
              value={state.active_ingredient.value || null}
              onChange={value => onChangeHandle({ target: { name: 'active_ingredient', value: value } })}
            />
          </Row>

          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>
              Торгівельна назва{' '}
              <span style={{ cursor: 'pointer' }} onClick={() => setOpenTradeNameModal(true)}>
                <Add />
              </span>
            </p>

            <Select
              options={tradeNames?.map(item => ({ value: item.id, label: item.name }))}
              placeholder='Trade Name'
              onChange={value => onChangeHandle({ target: { name: 'marked_name', value } })}
              value={state.marked_name.value || null}
            />
          </Row>

          <Row>
            <p>Країна виробник</p>
            <Input
              placeholder='Manufacturing country'
              required
              name='manufacturing_country'
              onChange={onChangeHandle}
              value={state.manufacturing_country.value}
            />
          </Row>

          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>
              Виробник
              <span style={{ cursor: 'pointer' }} onClick={() => setOpenMakerModal(true)}>
                <Add />
              </span>
            </p>

            <Select
              onChange={value => onChangeHandle({ target: { name: 'maker', value } })}
              value={state.maker.value || null}
              placeholder='Makers'
              options={makers?.map(item => ({ value: item.id, label: item.full_name }))}
            />
          </Row>

          <Row>
            <p>Імпорт</p>

            <Select value={state.imported.value} name='imported' onChange={onChangeHandle}>
              <Select.Option value={'Так'}>Так</Select.Option>
              <Select.Option value={'Ні'}>Ні</Select.Option>
            </Select>
          </Row>

          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>
              Дозування
              <span style={{ cursor: 'pointer' }} onClick={() => setOpenDosageModal(true)}>
                <Add />
              </span>
            </p>

            <Select
              placeholder='Dosage'
              options={dosage?.map(item => ({ value: item.id, label: item.name }))}
              onChange={value => onChangeHandle({ target: { name: 'dosage', value } })}
              value={state.dosage.value || null}
            />
          </Row>
          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>
              Форма
              <span style={{ cursor: 'pointer' }} onClick={() => setOpenFormModal(true)}>
                <Add />
              </span>
            </p>

            <Select
              placeholder='Form'
              options={forms?.map(item => ({ value: item.id, label: item.name }))}
              onChange={value => onChangeHandle({ target: { name: 'production_form', value } })}
              value={state.production_form.value || null}
            />
          </Row>
          <Row>
            <p>Без рецепта</p>

            <Select value={state.prescription.value} name='prescription' onChange={onChangeHandle}>
              <Select.Option value={'Так'}>Так</Select.Option>
              <Select.Option value={'Ні'}>Ні</Select.Option>
            </Select>
          </Row>
          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>
              Спосіб введення
              <span style={{ cursor: 'pointer' }} onClick={() => setOpenRouteModal(true)}>
                <Add />
              </span>
            </p>

            <Select
              placeholder='Administration Route'
              options={route?.map(item => ({ value: item.id, label: item.name }))}
              onChange={value => onChangeHandle({ target: { name: 'administration_route', value } })}
              value={state.administration_route.value || null}
            />
          </Row>
          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>
              Кількість в упаковці
              <span style={{ cursor: 'pointer' }} onClick={() => setOpenQuantityModal(true)}>
                <Add />
              </span>
            </p>

            <Select
              placeholder='Quantity'
              options={quantity?.map(item => ({ value: item.id, label: item.name }))}
              onChange={value => onChangeHandle({ target: { name: 'quantity', value } })}
              value={state.quantity.value || null}
            />
          </Row>
          <Row>
            <p>Термін придатності</p>

            <Select
              value={state.expiration.value}
              onChange={value =>
                onChangeHandle({
                  target: {
                    name: 'expiration',
                    value,
                  },
                })
              }
              name='expiration'
            >
              <Select.Option value={'1 рік'}>1 рік</Select.Option>
              <Select.Option value={'2 роки'}>2 роки</Select.Option>
              <Select.Option value={'3 роки'}>3 роки</Select.Option>
              <Select.Option value={'4 роки'}>4 роки</Select.Option>
              <Select.Option value={'5 років'}>1 років</Select.Option>
              <Select.Option value={'6 років'}>6 років</Select.Option>
            </Select>
          </Row>

          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>
              Температура зберігання
              <span style={{ cursor: 'pointer' }} onClick={() => setOpenTemperatureModal(true)}>
                <Add />
              </span>
            </p>

            <Select
              placeholder='Temperature'
              options={temperature?.map(item => ({ value: item.id, label: item.name }))}
              onChange={value => onChangeHandle({ target: { name: 'storage_temperature', value } })}
              value={state.storage_temperature.value || null}
            />
          </Row>
          <Row>
            <p style={{ display: 'flex', gap: '10px' }}>
              Упаковка
              <span style={{ cursor: 'pointer' }} onClick={() => setOpenPackageModal(true)}>
                <Add />
              </span>
            </p>

            <Select
              placeholder='Package'
              options={packages?.map(item => ({ value: item.id, label: item.name }))}
              onChange={value => onChangeHandle({ target: { name: 'package', value } })}
              value={state.package.value || null}
            />
          </Row>

          <p>Кому можна</p>

          <Row>
            <p>Алергікам</p>

            <Select
              value={warnings.allergy_warning.value}
              onChange={value => onChangeWarnings({ target: { value, name: 'allergy_warning' } })}
              name='allergy_warning'
            >
              {warningsItems.map((el, idx) => (
                <Select.Option key={idx} value={el.value}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Row>

          <Row>
            <p>Діабетикам</p>

            <Select
              value={warnings.diabetes_warning.value}
              name='diabetes_warning'
              onChange={value => onChangeWarnings({ target: { value, name: 'diabetes_warning' } })}
            >
              {warningsItems.map((el, idx) => (
                <Select.Option key={idx} value={el.value}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Row>

          <Row>
            <p>Водіям</p>

            <Select
              value={warnings.driving_warning.value}
              onChange={value => onChangeWarnings({ target: { value, name: 'driving_warning' } })}
              name='driving_warning'
            >
              {warningsItems.map((el, idx) => (
                <Select.Option key={idx} value={el.value}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Row>

          <Row>
            <p>Вігітним</p>

            <Select
              value={warnings.pregnancy_warning.value}
              onChange={value => onChangeWarnings({ target: { value, name: 'pregnancy_warning' } })}
            >
              {warningsItems.map((el, idx) => (
                <Select.Option key={idx} value={el.value}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Row>
          <Row>
            <p>Годуючим матерям</p>

            <Select
              value={warnings.breastfeeding_warning.value}
              onChange={value => onChangeWarnings({ target: { value, name: 'breastfeeding_warning' } })}
              name='breastfeeding_warning'
            >
              {warningsItems.map((el, idx) => (
                <Select.Option key={idx} value={el.value}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Row>
          <Row>
            <p>Взаємодія з алкоголем</p>

            <Select
              value={warnings.alcohol_warning.value}
              onChange={value => onChangeWarnings({ target: { value, name: 'alcohol_warning' } })}
              name='alcohol_warning'
            >
              {warningsItems.map((el, idx) => (
                <Select.Option key={idx} value={el.value}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Row>
          <Row>
            <p>Дітям</p>

            <Select
              value={warnings.child_warning.value}
              placeholder='Expiration'
              name='child_warning'
              onChange={value => onChangeWarnings({ target: { value, name: 'child_warning' } })}
            >
              {childItems.map((el, idx) => (
                <Select.Option key={idx} value={el.value}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Row>
        </Wrapper>
      </Modal>

      <CreateSubstanceModal
        callback={fetchSubstanceList}
        handleClose={() => setOpenSubstaceModal(false)}
        open={openSubstaceModal}
      />
      <CreateTradeNameModal
        callback={fetchTradeNamesList}
        handleClose={() => setOpenTradeNameModal(false)}
        open={openTradeNameModal}
      />
      <CreateMakerModal callback={fetchMakersList} open={openMakerModal} handleClose={() => setOpenMakerModal(false)} />

      <CreateFormModal callback={fetchFormsList} open={openFormModal} handleClose={() => setOpenFormModal(false)} />
      <CreateRouteModal callback={fetchRoutesList} open={openRouteModal} handleClose={() => setOpenRouteModal(false)} />
      <CreateDosageModal
        callback={fetchDosageList}
        open={openDosageModal}
        handleClose={() => setOpenDosageModal(false)}
      />
      <CreateQuantityModal
        callback={fetchQuantityList}
        open={openQuantityModal}
        handleClose={() => setOpenQuantityModal(false)}
      />
      <CreateTemperatureModal
        callback={fetchTemperatureList}
        open={openTemperatureModal}
        handleClose={() => setOpenTemperatureModal(false)}
      />
      <CreatePackageModal
        callback={fetchPackagesList}
        open={openPackageModal}
        handleClose={() => setOpenPackageModal(false)}
      />
    </Box>
  )
}

const Wrapper = styled.div`
  padding: 20px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  align-content: center;
  border-bottom: 1px solid gray;
  padding: 3px 0;
`
