<script lang="ts" setup>
import _ from 'lodash'
import { NModal, NInput, NButton, useNotification, FormInst, NForm, NFormItem } from 'naive-ui'
import { PropType } from 'vue'
import { useCategory, Category } from '~/stores/category'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  category: {
    type: Object as PropType<Category>,
    default: (): Category => ({
      _id: '',
      title: '',
    }),
  },
})
const emit = defineEmits(['update:modelValue'])

const categoryStore = useCategory()
const notification = useNotification()

const formRef = ref<FormInst | null>(null)
const isModalVisible = useSyncProps<boolean>(props, 'modelValue', emit)
const form = ref<Category>(_.cloneDeep(props.category))
const rules = {
  title: {
    required: true,
    message: 'Введите название',
    trigger: 'blur',
  },
}

function editCategory() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        await categoryStore.editCategory(form.value)
        notification.success({
          content: 'Категория успешно изменена',
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

watch(
  () => props.category,
  () => {
    form.value = _.cloneDeep(props.category)
  }
)
</script>

<template>
  <NModal
    v-model:show="isModalVisible"
    class="custom-card"
    preset="card"
    :style="{ width: '600px' }"
    title="Редактирование категории"
    :bordered="false"
    size="medium"
  >
    <NForm ref="formRef" :label-width="80" :model="form" :rules="rules" size="medium">
      <NFormItem label="Название" path="title">
        <NInput v-model:value="form.title" type="text" />
      </NFormItem>
    </NForm>

    <template #footer>
      <NButton secondary type="primary" @click="editCategory">Изменить</NButton>
    </template>
  </NModal>
</template>
