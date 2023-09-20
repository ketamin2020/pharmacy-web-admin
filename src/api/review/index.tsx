import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_REVIEWS = 'api/review/get'
const GET_REVIEWS_BY_MORION = 'api/review/reviews-list'
const CREATE_REVIEWS = 'api/review/create'
const UPDATE_REVIEWS = 'api/review/update'
const DELETE_REVIEWS = 'api/review/delete'
const GET_LAST_REVIEWS = 'api/review/last-reviews'

export const getReviews = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_REVIEWS, params).then(res => res?.data?.data)
}

export const getLastReviews = () => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_LAST_REVIEWS).then(res => res?.data?.data)
}

export const getReviewsByPropertyId = params => {
  return axiosInstance
    .get<AxiosResponse<{ data: object }>>(GET_REVIEWS_BY_MORION, { params })
    .then(res => res?.data?.data)
}
export const createReview = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_REVIEWS, params).then(res => res?.data?.data)
}
export const updateReview = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_REVIEWS, params).then(res => res)
}
export const deleteReview = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_REVIEWS}?id=${id}`).then(res => res)
}
