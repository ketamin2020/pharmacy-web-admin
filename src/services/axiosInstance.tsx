import axios from 'axios'
import { getTokenFromLS } from 'utils/getTokenFromLS'
import moment from 'moment-timezone'
import { store } from 'store/store'

const axiosInstance = (() => {
  const params = {}
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',

    'X-timezone': moment.tz.guess(),
  }

  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    params,
    headers,
  })
})()

axiosInstance.interceptors.request.use(
  config => {
    const token = store.getState().auth.tokens?.refresh?.token

    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  error => Promise.reject(error),
)

export default axiosInstance
