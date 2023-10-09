<script lang="ts" setup>
import { NModal, NInput, NButton, useNotification, NForm, NFormItem, FormInst } from 'naive-ui'
import { useCategory, Category } from '~/stores/category'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const categoryStore = useCategory()
const notification = useNotification()

const formRef = ref<FormInst | null>(null)
const isModalVisible = useSyncProps<boolean>(props, 'modelValue', emit)
const form = ref<Omit<Category, '_id'>>({
  title: '',
})
const rules = {
  title: {
    required: true,
    message: 'Введите название',
    trigger: 'blur',
  },
}

function createCategory() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        await categoryStore.createCategory(form.value)
        notification.success({
          content: 'Категория успешно создана',
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
    title="Новая категория"
    :bordered="false"
    size="medium"
  >
    <NForm ref="formRef" :label-width="80" :model="form" :rules="rules" size="medium">
      <NFormItem label="Название" path="title">
        <NInput v-model:value="form.title" type="text" placeholder="" />
      </NFormItem>
    </NForm>

    <template #footer>
      <NButton secondary type="primary" @click="createCategory">Создать</NButton>
    </template>
  </NModal>
</template>
