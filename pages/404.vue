<script lang="ts" setup>
// compiler macro
definePageMeta({
  layout: 'page',
})
useHead(() => ({
  title: '404',
}))
</script>

<template>
  <PageWrapper class="flex flex-col items-center justify-center">
    <Error :code="404" />
  </PageWrapper>
</template>
