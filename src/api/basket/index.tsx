import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_BASKET_LIST = 'api/basket/basket'
const GET_USER_BASKET_LIST = 'api/basket/user-basket'
const CREATE_BASKET_LIST = 'api/basket/basket-create'
const DELETE_BASKET = 'api/basket/basket-delete'
const QTY_BASKET = 'api/basket/qty'
export const getBasketList = () => {
  return axiosInstance.get<AxiosResponse>(GET_BASKET_LIST).then(res => res?.data)
}

export const getUserBasketList = () => {
  return axiosInstance.get<AxiosResponse>(GET_USER_BASKET_LIST).then(res => res?.data)
}

export const addProductToBasketList = params => {
  return axiosInstance.post<AxiosResponse>(CREATE_BASKET_LIST, params).then(res => res?.data)
}
export const deleteItemFromBasketList = id => {
  return axiosInstance.delete<AxiosResponse>(`${DELETE_BASKET}?id=${id}`).then(res => res?.data)
}
export const increaseBusketItemQty = id => {
  return axiosInstance
    .put<AxiosResponse>(`${QTY_BASKET}`, {
      id,
      modifier: 'increase',
    })
    .then(res => res?.data)
}
export const decreaseBusketItemQty = id => {
  return axiosInstance
    .put<AxiosResponse>(`${QTY_BASKET}`, {
      id,
      modifier: 'decrease',
    })
    .then(res => res?.data)
}
