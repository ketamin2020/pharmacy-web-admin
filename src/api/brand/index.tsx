import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_BRANDS = 'api/brands/get'
const CREATE_BRAND = 'api/brands/create'
const UPDATE_BRAND = 'api/brands/update'
const DELETE_BRAND = 'api/brands/delete'

export const getBrands = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_BRANDS, params).then(res => res?.data?.data)
}
export const createBrand = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_BRAND, params).then(res => res)
}
export const updateBrand = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_BRAND, params).then(res => res)
}
export const deleteBrand = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_BRAND}?id=${id}`).then(res => res)
}
