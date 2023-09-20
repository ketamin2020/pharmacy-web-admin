import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_MAKERS = 'api/makers/get'
const CREATE_MAKER = 'api/makers/create'
const UPDATE_MAKER = 'api/makers/update'
const DELETE_MAKER = 'api/makers/delete'

export const getMakers = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_MAKERS, params).then(res => res?.data?.data)
}
export const createMaker = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_MAKER, params).then(res => res)
}
export const updateMaker = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_MAKER, params).then(res => res)
}
export const deleteMaker = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_MAKER}?id=${id}`).then(res => res)
}
