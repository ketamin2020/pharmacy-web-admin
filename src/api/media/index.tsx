import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const UPLOAD_SINGLE_FILE = 'api/upload/upload-single'

const headers = { 'Content-Type': 'multipart/form-data' }
export const uploadSingleFile = (file: Blob) => {
  return axiosInstance
    .post<AxiosResponse<{ data: object }>>(UPLOAD_SINGLE_FILE, file, { headers })
    .then(res => res?.data?.data)
}
