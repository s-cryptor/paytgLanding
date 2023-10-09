<script lang="ts" setup>
import { NDataTable, DataTableColumns, useNotification, NImage, NCheckbox } from 'naive-ui'
import { h } from 'vue'
import { useProduct } from '~/stores/product'
import { useTopping } from '~/stores/topping'
import { Order, useOrder } from '~/stores/order'

const productStore = useProduct()
const toppingStore = useTopping()
const orderStore = useOrder()
const notification = useNotification()
const isLoading = ref(false)

function createColumns(): DataTableColumns<Order> {
  return [
    {
      title: '№',
      key: 'id',
    },
    {
      title: 'Дата',
      key: 'price',
      render(row) {
        return h('span', new Date(row.createdAt).toLocaleString())
      },
    },
    {
      title: 'Статус',
      key: 'status',
    },
    {
      title: 'Комментарий',
      key: 'comment',
    },
    {
      title: 'Заказ',
      key: 'details',
      render(row) {
        return h(
          'div',
          row.details.map((item) => {
            const product = productStore.getProductById(item.productId)
            return [
              h('b', product?.title),
              ' ',
              product?.weight[item.priceWeightOption],
              h('br'),
              ...item.toppingIds.map((toppingId) => [
                h(
                  'span',
                  { class: 'opacity-70' },
                  `+ ${toppingStore.getToppingById(toppingId)?.title}`
                ),
                h('br'),
              ]),
            ]
          })
        )
      },
    },
    {
      title: 'Сумма заказа',
      key: 'total',
      render(row) {
        let totalPrice = 0
        row.details.forEach((item) => {
          totalPrice +=
            productStore.getProductById(item.productId)?.price[item.priceWeightOption] || 0
          item.toppingIds.forEach((toppingId) => {
            totalPrice += toppingStore.getToppingById(toppingId)?.price || 0
          })
        })
        return h('span', [totalPrice, ' ₽'])
      },
    },
  ]
}

const columns = createColumns()

onBeforeMount(async () => {
  try {
    isLoading.value = true
    await orderStore.getHistory()
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
    :data="orderStore.history"
    :pagination="{ defaultPageSize: 20 }"
    :bordered="false"
    :loading="isLoading"
  />
</template>
