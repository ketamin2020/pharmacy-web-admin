import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_ROUTES = 'api/route/get'
const CREATE_ROUTE = 'api/route/create'
const UPDATE_ROUTE = 'api/route/update'
const DELETE_ROUTE = 'api/route/delete'

export const getRoutes = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_ROUTES, params).then(res => res?.data?.data)
}
export const createRoute = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_ROUTE, params).then(res => res)
}
export const updateRoute = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_ROUTE, params).then(res => res)
}
export const deleteRoute = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_ROUTE}?id=${id}`).then(res => res)
}
