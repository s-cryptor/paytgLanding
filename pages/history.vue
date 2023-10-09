<script lang="ts" setup>
// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: 'История заказов',
  meta: [
    {
      name: 'description',
      content: 'История заказов',
    },
  ],
}))
</script>

<template>
  <PageWrapper>
    <PageBody>
      <PageSection>
        <div class="flex gap-10 items-center mb-4">
          <PageSectionTitle text="История заказов" />
        </div>
        <OrderHistory />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
