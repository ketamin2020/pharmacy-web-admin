import axiosInstance from 'services/axiosInstance'
import { AxiosResponse } from 'axios'

const GET_BLOGS = 'api/blog/get'
const CREATE_BLOG = 'api/blog/create'
const DELETE_BLOG = 'api/blog/delete'
const UPDATE_BLOG = 'api/blog/update'
const CREATE_BLOG_CATEGORY = 'api/blog-category/create'
const GET_BLOG_CATEGORY = 'api/blog-category/get'

export const getBlogs = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_BLOGS, { params }).then(res => res?.data?.data)
}
export const getBlogsCategory = params => {
  return axiosInstance.get<AxiosResponse<{ data: object }>>(GET_BLOG_CATEGORY, { params }).then(res => res?.data?.data)
}
export const createBlog = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_BLOG, params).then(res => res)
}
export const createBlogCategory = params => {
  return axiosInstance.post<AxiosResponse<{ data: object }>>(CREATE_BLOG_CATEGORY, params).then(res => res)
}
export const updateBlog = params => {
  return axiosInstance.put<AxiosResponse<{ data: object }>>(UPDATE_BLOG, params).then(res => res)
}
export const deleteBlog = id => {
  return axiosInstance.delete<AxiosResponse<{ data: object }>>(`${DELETE_BLOG}?id=${id}`).then(res => res)
}
