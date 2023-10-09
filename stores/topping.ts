import { defineStore } from 'pinia'
import { Topping as ITopping } from '~/paytgTypes/models/topping'
import {
  ToppingGetResponse,
  ToppingDeleteResponse,
  ToppingUpdateResponse,
  ToppingCreateResponse,
} from '~/paytgTypes/net/topping'
import { httpClient } from '~~/utils/http-client'

const API_NAMESPACE = 'toppings'

export type Topping = ITopping & { _id: string }

export interface ToppingState {
  toppings: Array<Topping>
}

export const useTopping = defineStore('topping', {
  state: (): ToppingState => ({
    toppings: [],
  }),
  actions: {
    getToppingById(id: string) {
      return this.toppings.find((topping) => topping._id === id)
    },
    async getToppings() {
      const error = new Error('Ошибка загрузки топпингов')

      const response = await httpClient.get<ToppingGetResponse>(`${API_NAMESPACE}`).catch(() => {
        throw error
      })

      if (response.status === 200 && response.data.result) {
        this.toppings = response.data.result
        return
      }

      throw new Error(response.data.error)
    },
    async deleteTopping(_id: string) {
      const error = new Error('Ошибка удаления топпинга')

      const response = await httpClient
        .delete<ToppingDeleteResponse>(`${API_NAMESPACE}`, {
          data: { _id },
        })
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.success) {
        this.toppings = this.toppings.filter((topping) => topping._id !== _id)
        return
      }

      throw new Error(response.data.error)
    },
    async createTopping({ title, price }: Omit<Topping, '_id'>) {
      const error = new Error('Ошибка создания топпинга')

      const response = await httpClient
        .post<ToppingCreateResponse>(`${API_NAMESPACE}`, {
          title,
          price,
        })
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        this.toppings.push(response.data.result)
        return
      }

      throw new Error(response.data.error)
    },
    async editTopping(topping: Topping) {
      const error = new Error('Ошибка редактирования топпинга')

      const response = await httpClient
        .put<ToppingUpdateResponse>(`${API_NAMESPACE}`, topping)
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        this.toppings = this.toppings.map((element) =>
          element._id === topping._id ? topping : element
        )
        return
      }

      throw new Error(response.data.error)
    },
  },
})
