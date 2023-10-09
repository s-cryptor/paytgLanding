<script lang="ts" setup>
import {
  NDataTable,
  DataTableColumns,
  useDialog,
  useNotification,
  NImage,
  NCheckbox,
} from 'naive-ui'
import { h } from 'vue'
import ButtonIconEdit from '~/components/ButtonIcon/Edit.vue'
import ButtonIconDelete from '~/components/ButtonIcon/Delete.vue'
import { useProduct, Product } from '~/stores/product'
import { useShared } from '~/stores/shared'
import { useCategory } from '~/stores/category'
import { IMAGE_ENDPOINT } from '~/env'

type ProductRow = Product & { category: string }

const productStore = useProduct()
const categoryStore = useCategory()
const sharedStore = useShared()
const dialog = useDialog()
const notification = useNotification()

function createColumns({
  deleteProduct,
  openEditModal,
}: {
  deleteProduct: (row: ProductRow) => void
  openEditModal: (row: ProductRow) => void
}): DataTableColumns<ProductRow> {
  return [
    {
      title: 'Название',
      key: 'title',
      minWidth: 25,
      sorter: (row1, row2) => (row1.title > row2.title ? 1 : -1),
      render(row) {
        return h('b', null, [row.title])
      },
    },
    {
      title: 'Цена',
      key: 'price',
      minWidth: 60,
      render(row) {
        return h(
          'div',
          null,
          row.price.map((price) => [price, h('br')])
        )
      },
    },
    {
      title: 'Объем',
      key: 'weight',
      minWidth: 90,
      render(row) {
        return h(
          'div',
          null,
          row.weight.map((weight) => [weight, h('br')])
        )
      },
    },
    {
      title: 'Описание',
      key: 'description',
      minWidth: 200,
      render(row) {
        const nutrition = !row.nutrition ? [] : [h('br'), h('b', null, ['Состав: ']), row.nutrition]
        return h('div', null, [row.description, ...nutrition])
      },
    },
    {
      title: 'КБЖУ',
      key: 'kpfc',
      minWidth: 120,
      render(row) {
        return h('span', null, [[row.kcal, row.proteins, row.fats, row.carbs].join(' / ')])
      },
    },
    {
      title: 'Категория',
      key: 'category',
      sorter: (row1, row2) => (row1.categoryId > row2.categoryId ? 1 : -1),
    },
    {
      title: 'Изображение',
      key: 'image',
      minWidth: 120,
      render(row) {
        return h(NImage, {
          src: `${IMAGE_ENDPOINT}${row.imgSrc}`,
          width: '32',
          height: '32',
        })
      },
    },
    {
      title: 'В наличии',
      key: 'inStock',
      render(row) {
        return h(NCheckbox, {
          checked: row.inStock,
          onUpdateChecked: async (value) => {
            try {
              await productStore.updateStock({ ...row, inStock: value })
            } catch (error) {
              notification.error({
                content: (error as Error)?.message || '',
                duration: 5000,
              })
            }
          },
        })
      },
    },
    {
      title: 'Действие',
      minWidth: 120,
      key: 'actions',
      render(row) {
        return h('div', [
          h(ButtonIconEdit, {
            class: 'mr-2',
            onClick: () => openEditModal(row),
          }),
          h(ButtonIconDelete, { onClick: () => deleteProduct(row) }),
        ])
      },
    },
  ]
}

const isEditModalVisible = ref(false)
const productToEdit = ref<Product | null>(null)
const products = computed(() =>
  productStore.products.map((product) => ({
    ...product,
    category: categoryStore.getCategoryById(product.categoryId)?.title || '',
  }))
)
const columns = createColumns({
  openEditModal: (row: Product) => {
    productToEdit.value = row
    isEditModalVisible.value = true
  },
  deleteProduct(row: ProductRow) {
    dialog.warning({
      title: 'Удаление товара',
      content: `Вы действительно хотите удалить товар "${row.title}"`,
      positiveText: 'Да',
      negativeText: 'Нет',
      onPositiveClick: async () => {
        try {
          await productStore.deleteProduct(row._id)
          notification.success({
            content: 'Товар успешно удален',
            duration: 5000,
          })
        } catch (error) {
          notification.error({
            content: (error as Error)?.message || '',
            duration: 5000,
          })
        }
      },
    })
  },
})
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="products"
    :pagination="false"
    :bordered="false"
    :loading="sharedStore.isLoading"
  />

  <ProductEditModal v-model="isEditModalVisible" :product="productToEdit" />
</template>
