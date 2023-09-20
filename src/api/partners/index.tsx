import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_PARTNERS = 'api/partners/get'
const CREATE_PARTNER = 'api/partners/create'
const UPDATE_PARTNER = 'api/partners/update'
const DELETE_PARTNER = 'api/partners/delete'

export const getPartners = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_PARTNERS, params).then(res => res?.data?.data)
}
export const createPartner = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_PARTNER, params).then(res => res)
}
export const updatePartner = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_PARTNER, params).then(res => res)
}
export const deletePartner = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_PARTNER}?id=${id}`).then(res => res)
}
