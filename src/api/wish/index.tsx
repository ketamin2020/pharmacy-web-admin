import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_WISH_LIST = 'api/wishes/wishlist'
const GET_USER_WISH_LIST = 'api/wishes/user-wishlist'
const CREATE_WISH_LIST = 'api/wishes/wishlist-create'
const DELETE_WISHES = 'api/wishes/wishlist-delete'
export const getWishList = () => {
  return axiosInstance.get<AxiosResponse>(GET_WISH_LIST).then(res => res?.data)
}

export const getUserWishList = () => {
  return axiosInstance.get<AxiosResponse>(GET_USER_WISH_LIST).then(res => res?.data)
}

export const addProductToWishList = params => {
  return axiosInstance.post<AxiosResponse>(CREATE_WISH_LIST, params).then(res => res?.data)
}
export const deleteItemFromWishList = id => {
  return axiosInstance.delete<AxiosResponse>(`${DELETE_WISHES}?id=${id}`).then(res => res?.data)
}
