import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_TRADE_NAMES = 'api/trade-name/get'
const CREATE_TRADE_NAME = 'api/trade-name/create'
const UPDATE_TRADE_NAME = 'api/trade-name/update'
const DELETE_TRADE_NAME = 'api/trade-name/delete'

export const getTradeNames = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_TRADE_NAMES, params).then(res => res?.data?.data)
}
export const createTradeName = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_TRADE_NAME, params).then(res => res.data.data)
}
export const updateTradeName = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_TRADE_NAME, params).then(res => res)
}
export const deleteTradeName = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_TRADE_NAME}?id=${id}`).then(res => res)
}
