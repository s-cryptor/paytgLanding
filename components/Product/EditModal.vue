<script lang="ts" setup>
import _ from 'lodash'
import { lyla } from 'lyla'
import {
  NModal,
  NInput,
  NButton,
  useNotification,
  NForm,
  NFormItem,
  NInputNumber,
  FormInst,
  NSelect,
  NUpload,
  NUploadDragger,
  UploadFileInfo,
  UploadCustomRequestOptions,
} from 'naive-ui'
import { PropType } from 'vue'
import { useProduct, Product } from '~/stores/product'
import { useCategory } from '~/stores/category'
import { useTopping } from '~/stores/topping'
import { useAuth } from '~/stores/auth'
import { API_BASE, IMAGE_ENDPOINT } from '~/env'
import { ProductImageUploadResponse } from '~/paytgTypes/net/product'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  product: {
    type: Object as PropType<Product>,
    default: (): Product => ({
      _id: '',
      title: '',
      imgSrc: '',
      price: [0],
      weight: [''],
      description: '',
      kcal: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      categoryId: '',
      toppingIds: [],
      nutrition: '',
      inStock: true,
    }),
  },
})
const emit = defineEmits(['update:modelValue'])

const productStore = useProduct()
const categoryStore = useCategory()
const toppingStore = useTopping()
const authStore = useAuth()
const notification = useNotification()

const isModalVisible = useSyncProps<boolean>(props, 'modelValue', emit)
const form = ref<Product>(_.cloneDeep(props.product))
const formRef = ref<FormInst | null>(null)
const rules = {
  title: {
    required: true,
    trigger: 'blur',
    message: 'Введите название',
  },
}
const categoryOptions = computed(() =>
  categoryStore.categories.map((category) => ({
    label: category.title,
    value: category._id,
  }))
)
const fileList = ref<Array<UploadFileInfo>>([])
const toppingOptions = computed(() =>
  toppingStore.toppings.map((topping) => ({
    label: topping.title,
    value: topping._id,
  }))
)

let previewPromiseResolver: null | ((value: string) => void) = null
let previewPromise: Promise<string> = new Promise((resolve) => {
  previewPromiseResolver = resolve
})

function createThumbnailUrl(): Promise<string> {
  return previewPromise
}

function uploadImage({
  file,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress,
}: UploadCustomRequestOptions) {
  const formData = new FormData()
  formData.append('file', file.file as File)
  lyla
    .post<ProductImageUploadResponse>(action as string, {
      withCredentials,
      headers: headers as Record<string, string>,
      body: formData,
      onUploadProgress: ({ percent }) => {
        onProgress({ percent: Math.ceil(percent) })
      },
    })
    .then(({ json }) => {
      if (previewPromiseResolver) {
        previewPromiseResolver(`${IMAGE_ENDPOINT}${json.result?.path}`)
        previewPromise = new Promise((resolve) => {
          previewPromiseResolver = resolve
        })
      }
      form.value.imgSrc = json.result?.path || ''
      onFinish()
    })
    .catch(() => {
      notification.error({
        content: 'Не удалось загрузить картинку',
        duration: 5000,
      })
      onError()
    })
}

function editProduct() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        await productStore.editProduct(form.value)
        notification.success({
          content: 'Товар успешно изменен',
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

function addPriceWeightOption(): void {
  form.value.price.push(0)
  form.value.weight.push('')
}

function deletePriceWeightOption(index: number): void {
  form.value.price.splice(1, 1)
  form.value.weight.splice(1, 1)
}

watch(
  () => props.product,
  () => {
    form.value = _.cloneDeep(props.product)
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
        <NInput v-model:value="form.title" type="text" placeholder="Эспрессо" />
      </NFormItem>
      <NFormItem label="Описание" path="description">
        <NInput v-model:value="form.description" type="text" placeholder="Крепкий черный кофе" />
      </NFormItem>
      <NFormItem label="Состав" path="nutrition">
        <NInput v-model:value="form.nutrition" type="text" placeholder="Кофе" />
      </NFormItem>

      <div v-for="(option, index) in form.price" :key="index" class="flex gap-2">
        <NFormItem label="Цена" path="price">
          <NInputNumber v-model:value="form.price[index]" placeholder="179 ₽" />
        </NFormItem>
        <NFormItem label="Объем (г или мл)" path="weight" class="w-100">
          <NInput v-model:value="form.weight[index]" type="text" placeholder="30 мл" />
        </NFormItem>
        <NButton
          v-if="index > 0"
          ghost
          type="error"
          class="mb-6 self-end"
          @click="deletePriceWeightOption(index)"
        >
          <IconMaterialSymbols:deleteOutline />
        </NButton>
      </div>

      <div class="mb-4">
        <NButton dashed class="w-full" @click="addPriceWeightOption">Добавить другой объем</NButton>
      </div>

      <div class="flex gap-2">
        <NFormItem label="Ккал (на 100г)" path="kcal">
          <NInputNumber v-model:value="form.kcal" placeholder="4" />
        </NFormItem>
        <NFormItem label="Жиры" path="fats">
          <NInputNumber v-model:value="form.fats" placeholder="0" />
        </NFormItem>
        <NFormItem label="Белки" path="proteins">
          <NInputNumber v-model:value="form.proteins" placeholder="0" />
        </NFormItem>
        <NFormItem label="Углеводы" path="carbs">
          <NInputNumber v-model:value="form.carbs" placeholder="1" />
        </NFormItem>
      </div>

      <NFormItem label="Категория" path="categoryId">
        <NSelect v-model:value="form.categoryId" :options="categoryOptions" />
      </NFormItem>
      <NFormItem label="Возможные топпинги" path="toppingIds">
        <NSelect
          v-model:value="form.toppingIds"
          multiple
          placeholder="Выберите топпинги"
          :options="toppingOptions"
        />
      </NFormItem>

      <NFormItem label="Новое изображение" path="imgSrc">
        <NUpload
          :action="`${API_BASE}products/upload`"
          :headers="{ authorization: authStore.password }"
          list-type="image"
          :default-file-list="fileList"
          :max="1"
          :create-thumbnail-url="createThumbnailUrl"
          :custom-request="uploadImage"
        >
          <NUploadDragger>
            <div>Нажмите или перетащите изображение</div>
          </NUploadDragger>
        </NUpload>
      </NFormItem>
    </NForm>

    <template #footer>
      <NButton secondary type="primary" @click="editProduct">Изменить</NButton>
    </template>
  </NModal>
</template>
