import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

export const loginUserAdmin = params => {
  return axiosInstance.post<AxiosResponse<{ token: string }>>('api/admin/admin-login', params).then(res => res?.data)
}

export const logoutUserAdmin = params => {
  return axiosInstance.post<AxiosResponse<{ token: string }>>('api/admin/admin-logout', params).then(res => res?.data)
}

export const refreshUserAdmin = params => {
  return axiosInstance.post<AxiosResponse<{ token: string }>>('api/admin/admin-refresh', params).then(res => res?.data)
}
