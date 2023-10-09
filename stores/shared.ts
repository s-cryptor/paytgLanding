import { defineStore } from 'pinia'

export interface SharedState {
  isLoading: boolean
}

export const useShared = defineStore('shared', {
  state: (): SharedState => ({
    isLoading: false,
  }),
})
