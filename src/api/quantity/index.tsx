import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_QUANTITY = 'api/quantity/get'
const CREATE_QUANTITY = 'api/quantity/create'
const UPDATE_QUANTITY = 'api/quantity/update'
const DELETE_QUANTITY = 'api/quantity/delete'

export const getQuantity = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_QUANTITY, params).then(res => res?.data?.data)
}
export const createQuantity = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_QUANTITY, params).then(res => res)
}
export const updateQuantity = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_QUANTITY, params).then(res => res)
}
export const deleteQuantity = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_QUANTITY}?id=${id}`).then(res => res)
}
