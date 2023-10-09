<script lang="ts" setup>
import { NButton } from 'naive-ui'

// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: 'Топпинги',
  meta: [
    {
      name: 'description',
      content: 'Страница топпингов',
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
          <PageSectionTitle text="Топпинги" />
          <NButton type="primary" @click="isModalVisible = true">Добавить</NButton>
        </div>
        <ToppingTable />
      </PageSection>
    </PageBody>

    <ToppingCreateModal v-model="isModalVisible" />
  </PageWrapper>
</template>
