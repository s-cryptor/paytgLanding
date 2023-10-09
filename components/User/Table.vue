<script lang="ts" setup>
import { NDataTable, DataTableColumns, useNotification } from 'naive-ui'
import { h } from 'vue'
import { User, useUser } from '~/stores/user'
import { useOrder } from '~/stores/order'

const userStore = useUser()
const orderStore = useOrder()
const notification = useNotification()
const isLoading = ref(false)

function createColumns(): DataTableColumns<User> {
  return [
    {
      title: '№',
      key: 'id',
    },
    {
      title: 'Кол-во заказов',
      key: 'orderCount',
      render(row) {
        return h('span', orderStore.history.filter((order) => order.userId === row.id).length)
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render() {
        return h('span', 'Скоро...')
      },
    },
  ]
}

const columns = createColumns()

onBeforeMount(async () => {
  try {
    isLoading.value = true
    await Promise.all([userStore.getUsers(), orderStore.getHistory()])
  } catch (error) {
    notification.error({
      content: (error as Error)?.message || '',
      duration: 5000,
    })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="userStore.users"
    :pagination="{ defaultPageSize: 20 }"
    :bordered="false"
    :loading="isLoading"
  />
</template>
