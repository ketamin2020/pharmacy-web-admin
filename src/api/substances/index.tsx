import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_SUBSTANCES = 'api/substances/get'
const CREATE_SUBSTANCE = 'api/substances/create'
const UPDATE_SUBSTANCE = 'api/substances/update'
const DELETE_SUBSTANCE = 'api/substances/delete'

export const getSubstances = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_SUBSTANCES, params).then(res => res?.data?.data)
}
export const createSubstance = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_SUBSTANCE, params).then(res => res)
}
export const updateSubstance = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_SUBSTANCE, params).then(res => res)
}
export const deleteSubstance = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_SUBSTANCE}?id=${id}`).then(res => res)
}
