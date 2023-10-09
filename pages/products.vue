<script lang="ts" setup>
import { NButton } from 'naive-ui'

// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: 'Товары',
  meta: [
    {
      name: 'description',
      content: 'Страница товаров',
    },
  ],
}))

const isModalVisible = ref(false)
</script>

<template>
  <PageWrapper>
    <PageBody>
      <PageSection>
        <div class="flex gap-10 items-center mb-4">
          <PageSectionTitle text="Товары" />
          <NButton type="primary" @click="isModalVisible = true">Добавить</NButton>
        </div>
        <ProductTable />
      </PageSection>
    </PageBody>

    <ProductCreateModal v-model="isModalVisible" />
  </PageWrapper>
</template>
