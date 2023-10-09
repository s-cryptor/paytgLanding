<script lang="ts" setup>
// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: 'Заказы',
  meta: [
    {
      name: 'description',
      content: 'Управление заказами',
    },
  ],
}))
</script>

<template>
  <PageWrapper>
    <PageBody>
      <PageSection>
        <div class="flex gap-10 items-center mb-4">
          <PageSectionTitle text="Заказы" />
        </div>
        <OrderBoard />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
