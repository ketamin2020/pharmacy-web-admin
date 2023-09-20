import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_USERS = 'api/users/get'
const CREATE_USER = 'api/users/create'
const UPDATE_USER = 'api/users/update'
const DELETE_USER = 'api/users/delete'
const GET_USER_BY_TOKEN = 'api/users/get-by-token'

export const getUser = () => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_USERS).then(res => res?.data?.data)
}
export const getUserByToken = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_USER_BY_TOKEN, { params }).then(res => res?.data?.data)
}
export const createUser = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_USER, params).then(res => res)
}
export const updateUser = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_USER, params).then(res => res?.data?.data)
}
export const deleteUser = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_USER}?id=${id}`).then(res => res)
}
