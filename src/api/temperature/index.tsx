import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_TEMPERATURE = 'api/temperature/get'
const CREATE_TEMPERATURE = 'api/temperature/create'
const UPDATE_TEMPERATURE = 'api/temperature/update'
const DELETE_TEMPERATURE = 'api/temperature/delete'

export const getTemperatures = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_TEMPERATURE, params).then(res => res?.data?.data)
}
export const createTemperature = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_TEMPERATURE, params).then(res => res)
}
export const updateTemperature = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_TEMPERATURE, params).then(res => res)
}
export const deleteTemperature = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_TEMPERATURE}?id=${id}`).then(res => res)
}
