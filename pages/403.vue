<script setup lang="ts">
definePageMeta({
    layout: 'my-layout'
})

useHead({
  title: `403 | Ini Toko`,
  titleTemplate: `403 | Ini Toko`,
})
</script>
<template>
    <div class="h-screen flex flex-col items-center justify-center">
        <NuxtImg :src="'/img/error.jpg'" class="block w-full md:w-1/3" />
        <h2 class="text-xl md:text-2xl xl:text-3xl"><span class="font-semibold">403</span> FORBIDDEN</h2>
    </div>
</template>