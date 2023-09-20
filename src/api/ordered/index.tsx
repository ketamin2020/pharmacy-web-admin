import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_ORDER_LIST = 'api/order/basket'
const GET_USER_ORDER_LIST = 'api/order/user-ordered'
const CREATE_ORDER = 'api/order/ordered-create'
const UPDATE_ORDER = 'api/order/ordered-update'
const DELETE_ORDER = 'api/order/ordered-delete'
const ORDER_BY_ID = 'api/order/ordered-id'

export const getOrderList = () => {
  return axiosInstance.get<AxiosResponse>(GET_ORDER_LIST).then(res => res?.data)
}

export const getUserOrderList = () => {
  return axiosInstance.get<AxiosResponse>(GET_USER_ORDER_LIST).then(res => res?.data)
}
export const getOrderById = params => {
  return axiosInstance.get<AxiosResponse>(ORDER_BY_ID, { params }).then(res => res?.data?.data)
}

export const createNewOrder = params => {
  return axiosInstance.post<AxiosResponse>(CREATE_ORDER, params).then(res => res?.data)
}
export const updateOrder = params => {
  return axiosInstance.put<AxiosResponse>(UPDATE_ORDER, params).then(res => res?.data)
}
export const deleteOrder = id => {
  return axiosInstance.delete<AxiosResponse>(`${DELETE_ORDER}?id=${id}`).then(res => res?.data)
}
