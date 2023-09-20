import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'
export const loginUser = params => {
  return axiosInstance.post<AxiosResponse<{ token: string }>>('api/auth/login', params).then(res => res?.data)
}
