import { defineStore } from 'pinia'

export interface AuthState {
  password: string
}

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    password: useCookie<string>('password').value,
  }),
})
