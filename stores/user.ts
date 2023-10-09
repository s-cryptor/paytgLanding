import { defineStore } from 'pinia'
import { User as IUser } from '~/paytgTypes/models/user'
import { UserGetAllResponse } from '~/paytgTypes/net/user'
import { httpClient } from '~~/utils/http-client'

const API_NAMESPACE = 'users'

export type User = IUser & { _id: string }

export interface UserState {
  users: Array<User>
}

export const useUser = defineStore('user', {
  state: (): UserState => ({
    users: [],
  }),
  actions: {
    getUserById(id: string) {
      return this.users.find((user) => user._id === id)
    },
    async getUsers() {
      const error = new Error('Ошибка загрузки посетителей')

      const response = await httpClient.get<UserGetAllResponse>(`${API_NAMESPACE}`).catch(() => {
        throw error
      })

      if (response.status === 200 && response.data.result) {
        this.users = response.data.result
        return
      }

      throw new Error(response.data.error)
    },
  },
})
