<script lang="ts" setup>
import { NFormItem, NInput, NButton, useNotification } from 'naive-ui'
import { useAuth } from '~/stores/auth'
import { useProduct } from '~/stores/product'
import { useCategory } from '~/stores/category'
import { useTopping } from '~/stores/topping'
import { useOrder } from '~/stores/order'
import { useShared } from '~/stores/shared'

const authStore = useAuth()
const productStore = useProduct()
const categoryStore = useCategory()
const toppingStore = useTopping()
const orderStore = useOrder()
const sharedStore = useShared()
const notification = useNotification()

const password = ref('')
const isLoading = ref(false)

// app.vue
async function loadData() {
  try {
    sharedStore.isLoading = true
    await Promise.allSettled([
      productStore.getProducts(),
      categoryStore.getCategories(),
      toppingStore.getToppings(),
      orderStore.getOrders(),
    ])
  } catch {
    // silent
  } finally {
    sharedStore.isLoading = false
  }
}

async function login() {
  isLoading.value = true

  try {
    await authStore.login(password.value)
    await loadData()
    navigateTo('/')
  } catch (error) {
    notification.error({
      content: (error as Error).message,
      duration: 5000,
    })
  } finally {
    isLoading.value = false
  }
}

useHead(() => ({
  title: 'Вход',
}))
</script>

<template>
  <PageWrapper class="flex flex-col items-center justify-center w-screen h-screen">
    <NFormItem class="w-100">
      <NInput v-model:value="password" placeholder="Введите пароль" type="password" />
      <NButton class="ml-4" :loading="isLoading" @click="login">Войти</NButton>
    </NFormItem>
  </PageWrapper>
</template>
