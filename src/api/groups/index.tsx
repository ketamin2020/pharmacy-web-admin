import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_GROUPS = 'api/groups/get'
const GET_GROUPS_ITEMS = 'api/groups/items'
const CREATE_GROUP = 'api/groups/create'
const UPDATE_GROUP = 'api/groups/update'
const DELETE_GROUP = 'api/groups/delete'

export const getGroups = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_GROUPS, params).then(res => res?.data?.data)
}
export const getMenuGroups = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_GROUPS_ITEMS, params).then(res => res?.data?.data)
}
export const createGroup = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_GROUP, params).then(res => res)
}
export const updateGroup = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_GROUP, params).then(res => res)
}
export const deleteGroup = (id, level, parent_id) => {
  return axiosInstance
    .delete<AxiosResponse<{ data: object }>>(`${DELETE_GROUP}?id=${id}&level=${level}&parent_id=${parent_id}`)
    .then(res => res)
}
