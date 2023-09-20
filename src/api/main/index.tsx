import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_MAIN = 'api/main/get'
const CREATE_MAIN = 'api/main/create'
const UPDATE_MAIN = 'api/main/update'

export const getMain = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_MAIN, params).then(res => res?.data?.data)
}
export const createMain = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_MAIN, params).then(res => res)
}
export const updateMain = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_MAIN, params).then(res => res)
}
