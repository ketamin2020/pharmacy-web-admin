import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_FORMS = 'api/form/get'
const CREATE_FORM = 'api/form/create'
const UPDATE_FORM = 'api/form/update'
const DELETE_FORM = 'api/form/delete'

export const getForms = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_FORMS, params).then(res => res?.data?.data)
}
export const createForm = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_FORM, params).then(res => res)
}
export const updateForm = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_FORM, params).then(res => res)
}
export const deleteForm = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_FORM}?id=${id}`).then(res => res)
}
