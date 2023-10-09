<script lang="ts" setup>
// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: 'Посетители',
  meta: [
    {
      name: 'description',
      content: 'Посетители',
    },
  ],
}))
</script>

<template>
  <PageWrapper>
    <PageBody>
      <PageSection>
        <div class="flex gap-10 items-center mb-4">
          <PageSectionTitle text="Посетители" />
        </div>
        <UserTable />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
