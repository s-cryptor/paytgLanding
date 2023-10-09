import { defineStore } from 'pinia'
import { Product as IProduct } from '~/paytgTypes/models/product'
import {
  ProductGetResponse,
  ProductDeleteResponse,
  ProductUpdateResponse,
  ProductUpdateStockResponse,
  ProductCreateResponse,
} from '~/paytgTypes/net/product'
import { httpClient } from '~~/utils/http-client'

const API_NAMESPACE = 'products'

export type Product = IProduct & { _id: string }

export interface ProductState {
  products: Array<Product>
}

export const useProduct = defineStore('product', {
  state: (): ProductState => ({
    products: [],
  }),
  actions: {
    getProductById(id: string) {
      return this.products.find((product) => product._id === id)
    },
    async getProducts() {
      const error = new Error('Ошибка загрузки товаров')

      const response = await httpClient.get<ProductGetResponse>(`${API_NAMESPACE}`).catch(() => {
        throw error
      })

      if (response.status === 200 && response.data.result) {
        this.products = response.data.result
        return
      }

      throw new Error(response.data.error)
    },
    async deleteProduct(_id: string) {
      const error = new Error('Ошибка удаления товара')

      const response = await httpClient
        .delete<ProductDeleteResponse>(`${API_NAMESPACE}`, {
          data: { _id },
        })
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.success) {
        this.products = this.products.filter((product) => product._id !== _id)
        return
      }

      throw new Error(response.data.error)
    },
    async createProduct(product: Omit<Product, '_id'>) {
      const error = new Error('Ошибка создания товара')

      const response = await httpClient
        .post<ProductCreateResponse>(`${API_NAMESPACE}`, product)
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        this.products.push(response.data.result)
        return
      }

      throw new Error(response.data.error)
    },
    async editProduct(product: Product) {
      const error = new Error('Ошибка редактирования товара')

      const response = await httpClient
        .put<ProductUpdateResponse>(`${API_NAMESPACE}`, product)
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        this.products = this.products.map((element) =>
          element._id === product._id ? product : element
        )
        return
      }

      throw new Error(response.data.error)
    },
    async updateStock(product: Product) {
      const error = new Error('Ошибка обновления наличия товара')

      const response = await httpClient
        .post<ProductUpdateStockResponse>(`${API_NAMESPACE}/stock`, product)
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        this.products = this.products.map((element) =>
          element._id === product._id ? product : element
        )
        return
      }

      throw new Error(response.data.error)
    },
  },
})
