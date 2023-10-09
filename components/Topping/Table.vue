<script lang="ts" setup>
import { NDataTable, useDialog, DataTableColumns, useNotification } from 'naive-ui'
import { h } from 'vue'
import { useTopping, Topping } from '~/stores/topping'
import { useShared } from '~/stores/shared'
import ButtonIconEdit from '~/components/ButtonIcon/Edit.vue'
import ButtonIconDelete from '~/components/ButtonIcon/Delete.vue'

const toppingStore = useTopping()
const sharedStore = useShared()
const dialog = useDialog()
const notification = useNotification()

function createColumns({
  deleteTopping,
  openEditModal,
}: {
  deleteTopping: (row: Topping) => void
  openEditModal: (row: Topping) => void
}): DataTableColumns<Topping> {
  return [
    {
      title: 'Название',
      key: 'title',
      render(row) {
        return h('b', null, [row.title])
      },
    },
    {
      title: 'Цена',
      key: 'price',
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
            onClick: () => deleteTopping(row),
          }),
        ])
      },
    },
  ]
}

const columns = createColumns({
  openEditModal: (row: Topping) => {
    toppingToEdit.value = row
    isEditModalVisible.value = true
  },
  deleteTopping: (row: Topping) => {
    dialog.warning({
      title: 'Удаление топпинга',
      content: `Вы действительно хотите удалить топпинг "${row.title}"`,
      positiveText: 'Да',
      negativeText: 'Нет',
      onPositiveClick: async () => {
        try {
          await toppingStore.deleteTopping(row._id)
          notification.success({
            content: 'Топпинг успешно удален',
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
const toppingToEdit = ref<Topping | null>(null)
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="toppingStore.toppings"
    :pagination="false"
    :bordered="false"
    :loading="sharedStore.isLoading"
  />
  <ToppingEditModal v-model="isEditModalVisible" :topping="toppingToEdit" />
</template>
