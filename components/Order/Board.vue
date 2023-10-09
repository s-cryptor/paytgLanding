<script lang="ts" setup>
import { NGrid, NGridItem, NCard, useNotification, NButton, useDialog } from 'naive-ui'
import { Order, useOrder } from '~/stores/order'
import { useProduct } from '~/stores/product'
import { useTopping } from '~/stores/topping'
import { OrderStatus } from '~/paytgTypes/models/order'
// @ts-ignore
import notificationSoundSfx from '~/assets/sounds/notification.wav'

const statusMap: Record<string, OrderStatus> = {
  NEW: 'PROGRESS',
  PROGRESS: 'READY',
}

const notificationSound = new Audio(notificationSoundSfx)

const orderStore = useOrder()
const productStore = useProduct()
const toppingStore = useTopping()
const notification = useNotification()
const dialog = useDialog()

let fetchInterval: NodeJS.Timer | null = null

const newOrders = computed(() => orderStore.orders.filter((order) => order.status === 'NEW'))
const progressOrders = computed(() =>
  orderStore.orders.filter((order) => order.status === 'PROGRESS')
)
const readyOrders = computed(() => orderStore.orders.filter((order) => order.status === 'READY'))

enum DropType {
  Card,
  Column,
}

function onDragStart(event: DragEvent) {
  event.dataTransfer?.setData('text/plain', (event.target as HTMLElement)?.id)
}

function onDragover(event: DragEvent) {
  event.preventDefault()
}

function onDrop(event: DragEvent) {
  event.preventDefault()

  const draggingElId = event.dataTransfer?.getData('text/plain')
  if (!draggingElId) return

  const draggingEl = document.getElementById(draggingElId)
  const targetEl = (event.target as HTMLElement)?.closest(
    `[data-type='${DropType.Column}']`
  ) as HTMLElement

  if (statusMap[draggingEl?.dataset.status as OrderStatus] !== targetEl?.dataset.status) {
    notification.error({
      content: 'Действие невозможно',
      duration: 5000,
    })
    return
  }

  if (draggingEl) {
    targetEl?.appendChild(draggingEl)
    const order = orderStore.getOrderById(draggingElId)
    if (order) {
      updateOrderStatus(
        order,
        statusMap[draggingEl?.dataset.status as OrderStatus],
        draggingEl?.dataset.status as OrderStatus
      )
    }
  }
}

function cancelOrder(order: Order) {
  dialog.warning({
    title: 'Отмена заказа',
    content: `Вы действительно хотите отменить заказ`,
    positiveText: 'Да',
    negativeText: 'Нет',
    onPositiveClick: async () => {
      await updateOrderStatus(order, 'DONE', 'READY')
    },
  })
}

async function updateOrderStatus(order: Order, status: OrderStatus, fallbackStatus: OrderStatus) {
  try {
    order.status = status
    await orderStore.updateOrderStatus(order, status)
  } catch (error) {
    order.status = fallbackStatus
    notification.error({
      content: (error as Error)?.message || '',
      duration: 5000,
    })
  }
}

watch(newOrders, (newValue, oldValue) => {
  if (newValue.length > oldValue.length) {
    notificationSound.play()
  }
})

onMounted(() => {
  fetchInterval = setInterval(async () => {
    try {
      await orderStore.getOrders()
    } catch {
      // silent
    }
  }, 5_000)
})

onUnmounted(() => {
  if (fetchInterval) {
    clearInterval(fetchInterval)
  }
})
</script>

<template>
  <NGrid x-gap="12" :cols="3">
    <NGridItem
      id="board-column-new"
      :data-type="DropType.Column"
      data-status="NEW"
      class="relative h-auto border rounded p-2"
      @drop="onDrop"
      @dragover="onDragover"
    >
      <div class="text-lg font-weight-bold pb-10 mb-2">Новые</div>
      <div
        v-for="order in newOrders"
        :id="order._id"
        :key="order._id"
        class="mb-2 cursor-move"
        :data-type="DropType.Card"
        :data-status="order.status"
        :draggable="true"
        @dragstart="onDragStart"
      >
        <NCard :title="`№ ${order.id}`">
          <div
            v-for="product in order.details.map((detail) => ({
              ...productStore.getProductById(detail.productId),
              orderDetails: detail,
            }))"
            :key="product?._id"
          >
            <b>{{ product?.title }}</b>
            ·
            <span class="opacity-80">
              {{ product?.weight?.at(product.orderDetails.priceWeightOption) }}
            </span>
            <div
              v-for="topping in product.orderDetails.toppingIds.map((toppingId) =>
                toppingStore.getToppingById(toppingId)
              )"
              :key="topping?._id"
              class="opacity-80 ml-2"
            >
              + {{ topping?.title }}
            </div>
          </div>

          <br v-if="order.comment" />
          <div v-if="order.comment">
            <b>Комментарий к заказу:</b>
            {{ order.comment }}
          </div>

          <NButton class="mt-5" type="error" @click="cancelOrder(order)">Отменить</NButton>
        </NCard>
      </div>
    </NGridItem>

    <NGridItem
      id="board-column-in-progress"
      :data-type="DropType.Column"
      data-status="PROGRESS"
      class="relative h-auto border rounded p-2"
      @drop="onDrop"
      @dragover="onDragover"
    >
      <div class="text-lg font-weight-bold pb-10 mb-2">Готовятся</div>
      <div
        v-for="order in progressOrders"
        :id="order._id"
        :key="order._id"
        class="mb-2 cursor-move"
        :data-type="DropType.Card"
        :data-status="order.status"
        :draggable="true"
        @dragstart="onDragStart"
      >
        <NCard :title="`№ ${order.id}`">
          <div
            v-for="product in order.details.map((detail) => ({
              ...productStore.getProductById(detail.productId),
              orderDetails: detail,
            }))"
            :key="product?._id"
          >
            <b>{{ product?.title }}</b>
            ·
            <span class="opacity-80">
              {{ product?.weight?.at(product.orderDetails.priceWeightOption) }}
            </span>
            <div
              v-for="topping in product.orderDetails.toppingIds.map((toppingId) =>
                toppingStore.getToppingById(toppingId)
              )"
              :key="topping?._id"
              class="opacity-80 ml-2"
            >
              + {{ topping?.title }}
            </div>
          </div>

          <br v-if="order.comment" />
          <div v-if="order.comment">
            <b>Комментарий к заказу:</b>
            {{ order.comment }}
          </div>
        </NCard>
      </div>
    </NGridItem>

    <NGridItem
      id="board-column-ready"
      :data-type="DropType.Column"
      data-status="READY"
      class="relative h-auto border rounded p-2"
      @drop="onDrop"
      @dragover="onDragover"
    >
      <div class="text-lg font-weight-bold pb-10 mb-2">Готовы к выдаче</div>
      <div
        v-for="order in readyOrders"
        :id="order._id"
        :key="order._id"
        class="mb-2 cursor-move"
        :data-type="DropType.Card"
        :data-status="order.status"
        :draggable="true"
        @dragstart="onDragStart"
      >
        <NCard :title="`№ ${order.id}`">
          <div
            v-for="product in order.details.map((detail) => ({
              ...productStore.getProductById(detail.productId),
              orderDetails: detail,
            }))"
            :key="product?._id"
          >
            <b>{{ product?.title }}</b>
            ·
            <span class="opacity-80">
              {{ product?.weight?.at(product.orderDetails.priceWeightOption) }}
            </span>
            <div
              v-for="topping in product.orderDetails.toppingIds.map((toppingId) =>
                toppingStore.getToppingById(toppingId)
              )"
              :key="topping?._id"
              class="opacity-80 ml-2"
            >
              + {{ topping?.title }}
            </div>
          </div>

          <br v-if="order.comment" />
          <div v-if="order.comment">
            <b>Комментарий к заказу:</b>
            {{ order.comment }}
          </div>

          <NButton class="mt-5" type="primary" @click="updateOrderStatus(order, 'DONE', 'READY')">
            Закрыть
          </NButton>
        </NCard>
      </div>
    </NGridItem>
  </NGrid>
</template>
