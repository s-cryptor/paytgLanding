<script lang="ts" setup>
import { NDataTable, useDialog, DataTableColumns, useNotification } from 'naive-ui'
import { h } from 'vue'
import { useCategory, Category } from '~/stores/category'
import { useShared } from '~/stores/shared'
import ButtonIconEdit from '~/components/ButtonIcon/Edit.vue'
import ButtonIconDelete from '~/components/ButtonIcon/Delete.vue'

const categoryStore = useCategory()
const sharedStore = useShared()
const dialog = useDialog()
const notification = useNotification()

function createColumns({
  deleteCategory,
  openEditModal,
}: {
  deleteCategory: (row: Category) => void
  openEditModal: (row: Category) => void
}): DataTableColumns<Category> {
  return [
    {
      title: 'Название',
      key: 'title',
      render(row) {
        return h('b', null, [row.title])
      },
    },
    {
      title: 'Действие',
      key: 'actions',
      render(row) {
        return h('div', [
          h(ButtonIconEdit, {
            class: 'mr-2',
            onClick: () => openEditModal(row),
          }),
          h(ButtonIconDelete, {
            onClick: () => deleteCategory(row),
          }),
        ])
      },
    },
  ]
}

const columns = createColumns({
  openEditModal: (row: Category) => {
    categoryToEdit.value = row
    isEditModalVisible.value = true
  },
  deleteCategory: (row: Category) => {
    dialog.warning({
      title: 'Удаление категории',
      content: `Вы действительно хотите удалить категорию "${row.title}"`,
      positiveText: 'Да',
      negativeText: 'Нет',
      onPositiveClick: async () => {
        try {
          await categoryStore.deleteCategory(row._id)
          notification.success({
            content: 'Категория успешно удалена',
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
const isEditModalVisible = ref(false)
const categoryToEdit = ref<Category | null>(null)
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="categoryStore.categories"
    :pagination="false"
    :bordered="false"
    :loading="sharedStore.isLoading"
  />
  <CategoryEditModal v-model="isEditModalVisible" :category="categoryToEdit" />
</template>
