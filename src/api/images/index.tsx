import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_IMAGES = 'api/images/get'
const CREATE_IMAGES = 'api/images/create'
const UPDATE_IMAGES = 'api/images/update'
const DELETE_IMAGES = 'api/images/delete'

export const getImages = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_IMAGES, params).then(res => res?.data?.data)
}
export const createImages = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_IMAGES, params).then(res => res.data.data)
}
export const updateImages = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_IMAGES, params).then(res => res)
}
export const deleteImages = (itemId, imageId = '') => {
  return axiosInstance
    .delete<AxiosResponse<{ data: object }>>(`${DELETE_IMAGES}?id=${itemId}&image_id=${imageId}`)
    .then(res => res)
}
