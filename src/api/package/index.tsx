import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_PACKAGES = 'api/package/get'
const CREATE_PACKAGE = 'api/package/create'
const UPDATE_PACKAGE = 'api/package/update'
const DELETE_PACKAGE = 'api/package/delete'

export const getPackages = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_PACKAGES, params).then(res => res?.data?.data)
}
export const createPackage = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_PACKAGE, params).then(res => res)
}
export const updatePackage = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_PACKAGE, params).then(res => res)
}
export const deletePackage = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_PACKAGE}?id=${id}`).then(res => res)
}
