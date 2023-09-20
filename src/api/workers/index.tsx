import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_WORKERS = 'api/workers/get'
const CREATE_WORKER = 'api/workers/create'
const UPDATE_WORKER = 'api/workers/update'
const DELETE_WORKER = 'api/workers/delete'
const LOGIN_WORKER = 'api/workers/login'

export const getWorkers = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_WORKERS, params).then(res => res?.data?.data)
}
export const createWorker = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_WORKER, params).then(res => res)
}
export const updateWorker = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_WORKER, params).then(res => res)
}
export const deleteWorker = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_WORKER}?id=${id}`).then(res => res)
}
export const loginWorker = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(LOGIN_WORKER, params).then(res => res)
}
