<script lang="ts" setup>
import {
  NModal,
  NInput,
  NButton,
  useNotification,
  NForm,
  NFormItem,
  FormInst,
  NInputNumber,
} from 'naive-ui'
import { useTopping, Topping } from '~/stores/topping'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const toppingStore = useTopping()
const notification = useNotification()

const formRef = ref<FormInst | null>(null)
const isModalVisible = useSyncProps<boolean>(props, 'modelValue', emit)
const form = ref<Omit<Topping, '_id'>>({
  title: '',
  price: 0,
})
const rules = {
  title: {
    required: true,
    message: 'Введите название',
    trigger: 'blur',
  },
}

function createTopping() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        await toppingStore.createTopping(form.value)
        notification.success({
          content: 'Топпинг успешно создан',
          duration: 5000,
        })
        isModalVisible.value = false
      } catch (error) {
        notification.error({
          content: (error as Error)?.message || '',
          duration: 5000,
        })
      }
    }
  })
}
</script>

<template>
  <NModal
    v-model:show="isModalVisible"
    class="custom-card"
    preset="card"
    :style="{ width: '600px' }"
    title="Новый топпинг"
    :bordered="false"
    size="medium"
  >
    <NForm ref="formRef" :label-width="80" :model="form" :rules="rules" size="medium">
      <NFormItem label="Название" path="title">
        <NInput v-model:value="form.title" type="text" placeholder="" />
      </NFormItem>

      <NFormItem label="Цена" path="price">
        <NInputNumber v-model:value="form.price" type="text" placeholder="" />
      </NFormItem>
    </NForm>

    <template #footer>
      <NButton secondary type="primary" @click="createTopping">Создать</NButton>
    </template>
  </NModal>
</template>
