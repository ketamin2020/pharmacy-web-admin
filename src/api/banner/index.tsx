import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_BANNERS = 'api/banner/get'
const CREATE_BANNER = 'api/banner/create'
const DELETE_BANNER = 'api/banner/delete'

export const getBanners = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_BANNERS, params).then(res => res?.data?.data)
}
export const createBanner = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_BANNER, params).then(res => res)
}
export const deleteBanner = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_BANNER}?id=${id}`).then(res => res)
}
