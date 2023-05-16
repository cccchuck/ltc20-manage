import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from 'axios'
import { ClientResponse, ServerResponse } from '@/types'
import { getStorage } from './storage'

class Request {
  private instance: AxiosInstance
  constructor(config: CreateAxiosDefaults) {
    this.instance = axios.create(config)
    this.instance.interceptors.request.use((config) => {
      if (config.url !== '/login') {
        config.headers['X-Token'] = getStorage('token')
      }

      if (config.method === 'POST') {
        config.headers['Content-Type'] = 'application/json'
      }

      return config
    })
  }

  async GET<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ClientResponse<T>> {
    try {
      const response = await this.instance.get<ServerResponse<T>>(url, config)

      if (response.status === 200 && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data,
        }
      } else {
        return {
          success: false,
          data: response.data,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error,
      }
    }
  }

  async POST<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<ClientResponse<T>> {
    try {
      const response = await this.instance.post<ServerResponse<T>>(
        url,
        data,
        config
      )

      if (response.status === 200 && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data,
        }
      } else {
        return {
          success: false,
          data: response.data,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error,
      }
    }
  }
}

export const request = new Request({
  baseURL: 'https:/api.ltc20.club/',
  timeout: 5000,
})

export default Request
