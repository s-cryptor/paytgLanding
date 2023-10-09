import axios from 'axios'
import { API_BASE } from '~/env'

export const httpClient = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: useCookie<string>('password').value,
  },
})

httpClient.interceptors.request.use((config) => {
  config.headers.Authorization = useCookie<string>('password').value
  return config
})

httpClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      navigateTo('/login')
    }
    return error
  }
)
