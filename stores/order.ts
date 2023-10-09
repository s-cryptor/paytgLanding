import { defineStore } from 'pinia'
import { Order as IOrder, OrderStatus } from '~/paytgTypes/models/order'
import { OrderGetResponse, OrderUpdateResponse } from '~/paytgTypes/net/order'
import { httpClient } from '~~/utils/http-client'

const API_NAMESPACE = 'orders'

export type Order = IOrder & { _id: string }

export interface OrderState {
  orders: Array<Order>
  history: Array<Order>
}

export const useOrder = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    history: [],
  }),
  actions: {
    getOrderById(id: string) {
      return this.orders.find((order) => order._id === id)
    },
    async getOrders() {
      const error = new Error('Ошибка загрузки заказов')

      const response = await httpClient.get<OrderGetResponse>(`${API_NAMESPACE}`).catch(() => {
        throw error
      })

      if (response.status === 200 && response.data.result) {
        if (JSON.stringify(this.orders) !== JSON.stringify(response.data.result)) {
          this.orders = response.data.result
        }
        return
      }

      throw new Error(response.data.error)
    },
    async getHistory() {
      const error = new Error('Ошибка загрузки истории заказов')

      const response = await httpClient
        .get<OrderGetResponse>(`${API_NAMESPACE}/history`)
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        if (JSON.stringify(this.orders) !== JSON.stringify(response.data.result)) {
          this.history = response.data.result.reverse()
        }
        return this.history
      }

      throw new Error(response.data.error)
    },
    async updateOrderStatus(order: Order, status: OrderStatus) {
      const error = new Error('Ошибка обновления статуса заказа')

      const response = await httpClient
        .put<OrderUpdateResponse>(`${API_NAMESPACE}`, { _id: order._id, status })
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        this.orders = this.orders.map((element) => (element._id === order._id ? order : element))
        return
      }

      throw new Error(response.data.error)
    },
  },
})
