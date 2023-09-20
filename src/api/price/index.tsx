import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_PRICES = 'api/price/get'
const CREATE_PRICE = 'api/price/create'
const UPDATE_PRICE = 'api/price/update'
const DELETE_DELETE = 'api/price/delete'
const UPLOAD_PRICE = 'api/price/upload'

export const getPrices = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_PRICES, params).then(res => res?.data?.data)
}
export const createPrice = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_PRICE, params).then(res => res)
}
export const updatePrice = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_PRICE, params).then(res => res)
}
export const deletePrice = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_DELETE}?id=${id}`).then(res => res)
}

export const uploadPrice = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(UPLOAD_PRICE, params).then(res => res)
}
