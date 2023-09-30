import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_USERS = 'api/users/admin-users-list'
const CREATE_USER = 'api/users/admin-create'
const UPDATE_USER = 'api/users/admin-update'
const DELETE_USER = 'api/users/admin-delete'
const GET_USER_BY_TOKEN = 'api/users/get-by-token'

const GET_LIST_OF_USERS = 'api/users/get'

export const getUser = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_USERS, { params }).then(res => res?.data)
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

export const getUsersList = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_LIST_OF_USERS, { params }).then(res => res?.data?.data)
}
