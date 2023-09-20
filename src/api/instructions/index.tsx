import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_INSTRUCTIONS = 'api/instructions/get'
const CREATE_INSTRUCTION = 'api/instructions/create'
const UPDATE_INSTRUCTION = 'api/instructions/update'
const DELETE_INSTRUCTION = 'api/instructions/delete'

export const getInstructions = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_INSTRUCTIONS, params).then(res => res?.data?.data)
}
export const createInstruction = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_INSTRUCTION, params).then(res => res)
}
export const updateInstruction = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_INSTRUCTION, params).then(res => res)
}
export const deleteInstruction = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_INSTRUCTION}?id=${id}`).then(res => res)
}
