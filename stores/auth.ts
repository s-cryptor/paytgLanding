import { defineStore } from 'pinia'
import { LoginResponse } from '~/paytgTypes/net/auth'
import { httpClient } from '~~/utils/http-client'

const API_NAMESPACE = 'auth'

export interface AuthState {
  password: string
}

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    password: useCookie<string>('password').value,
  }),
  actions: {
    async login(password: string) {
      const error = new Error('Ошибка авторизации')

      const response = await httpClient
        .post<LoginResponse>(`${API_NAMESPACE}`, { password })
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        this.password = password
        useCookie<string>('password').value = password
        return
      }

      throw new Error(response.data.error)
    },
  },
})
