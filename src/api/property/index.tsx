import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_PROPPERTIES = 'api/properties/get'
const CREATE_PROPERTY = 'api/properties/create'
const UPDATE_PROPERTY = 'api/properties/update'
const DELETE_PROPERTY = 'api/properties/delete'

export const getProperties = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_PROPPERTIES, params).then(res => res?.data?.data)
}
export const createProperty = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_PROPERTY, params).then(res => res)
}
export const updateProperty = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_PROPERTY, params).then(res => res)
}
export const deleteProperty = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_PROPERTY}?id=${id}`).then(res => res)
}
