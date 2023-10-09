<script lang="ts" setup>
import _ from 'lodash'
import {
  NModal,
  NInput,
  NButton,
  useNotification,
  FormInst,
  NForm,
  NFormItem,
  NInputNumber,
} from 'naive-ui'
import { PropType } from 'vue'
import { useTopping, Topping } from '~/stores/topping'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  topping: {
    type: Object as PropType<Topping>,
    default: (): Topping => ({
      _id: '',
      title: '',
      price: 0,
    }),
  },
})
const emit = defineEmits(['update:modelValue'])

const toppingStore = useTopping()
const notification = useNotification()

const formRef = ref<FormInst | null>(null)
const isModalVisible = useSyncProps<boolean>(props, 'modelValue', emit)
const form = ref<Topping>(_.cloneDeep(props.topping))
const rules = {
  title: {
    required: true,
    message: 'Введите название',
    trigger: 'blur',
  },
}

function editTopping() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        await toppingStore.editTopping(form.value)
        notification.success({
          content: 'Топпинг успешно изменен',
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
  () => props.topping,
  () => {
    form.value = _.cloneDeep(props.topping)
  }
)
</script>

<template>
  <NModal
    v-model:show="isModalVisible"
    class="custom-card"
    preset="card"
    :style="{ width: '600px' }"
    title="Редактирование топпинга"
    :bordered="false"
    size="medium"
  >
    <NForm ref="formRef" :label-width="80" :model="form" :rules="rules" size="medium">
      <NFormItem label="Название" path="title">
        <NInput v-model:value="form.title" type="text" />
      </NFormItem>
      <NFormItem label="Цена" path="price">
        <NInputNumber v-model:value="form.price" type="text" />
      </NFormItem>
    </NForm>

    <template #footer>
      <NButton secondary type="primary" @click="editTopping">Изменить</NButton>
    </template>
  </NModal>
</template>
