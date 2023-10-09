import { defineStore } from 'pinia'
import { Category as ICategory } from '~/paytgTypes/models/category'
import {
  CategoryGetResponse,
  CategoryDeleteResponse,
  CategoryCreateResponse,
  CategoryUpdateResponse,
} from '~/paytgTypes/net/category'
import { httpClient } from '~~/utils/http-client'

const API_NAMESPACE = 'categories'

export type Category = ICategory & { _id: string }

export interface CategoryState {
  categories: Array<Category>
}

export const useCategory = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
  }),
  actions: {
    getCategoryById(id: string) {
      return this.categories.find((category) => category._id === id)
    },
    async getCategories() {
      const error = new Error('Ошибка загрузки товаров')

      const response = await httpClient.get<CategoryGetResponse>(`${API_NAMESPACE}`).catch(() => {
        throw error
      })

      if (response.status === 200 && response.data.result) {
        this.categories = response.data.result
        return
      }

      throw new Error(response.data.error)
    },
    async deleteCategory(_id: string) {
      const error = new Error('Ошибка удаления категории')

      const response = await httpClient
        .delete<CategoryDeleteResponse>(`${API_NAMESPACE}`, {
          data: { _id },
        })
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.success) {
        this.categories = this.categories.filter((category) => category._id !== _id)
        return
      }

      throw new Error(response.data.error)
    },
    async createCategory({ title }: { title: string }) {
      const error = new Error('Ошибка создания категории')

      const response = await httpClient
        .post<CategoryCreateResponse>(`${API_NAMESPACE}`, {
          title,
        })
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        this.categories.push(response.data.result)
        return
      }

      throw new Error(response.data.error)
    },
    async editCategory(category: Category) {
      const error = new Error('Ошибка обновления категории')

      const response = await httpClient
        .put<CategoryUpdateResponse>(`${API_NAMESPACE}`, category)
        .catch(() => {
          throw error
        })

      if (response.status === 200 && response.data.result) {
        this.categories = this.categories.map((element) =>
          element._id === category._id ? category : element
        )
        return
      }

      throw new Error(response.data.error)
    },
  },
})
