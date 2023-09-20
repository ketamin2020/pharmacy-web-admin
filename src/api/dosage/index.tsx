import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_DOSAGE = 'api/dosage/get'
const CREATE_DOSAGE = 'api/dosage/create'
const UPDATE_DOSAGE = 'api/dosage/update'
const DELETE_DOSAGE = 'api/dosage/delete'

export const getDosage = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_DOSAGE, params).then(res => res?.data?.data)
}
export const createDosage = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_DOSAGE, params).then(res => res)
}
export const updateDosage = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_DOSAGE, params).then(res => res)
}
export const deleteDosage = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_DOSAGE}?id=${id}`).then(res => res)
}
