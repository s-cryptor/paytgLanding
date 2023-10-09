<script lang="ts" setup>
import { NButton } from 'naive-ui'

// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: 'Категории',
  meta: [
    {
      name: 'description',
      content: 'Страница категорий',
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
          <PageSectionTitle text="Категории" />
          <NButton type="primary" @click="isModalVisible = true">Добавить</NButton>
        </div>
        <CategoryTable />
      </PageSection>
    </PageBody>

    <CategoryCreateModal v-model="isModalVisible" />
  </PageWrapper>
</template>
