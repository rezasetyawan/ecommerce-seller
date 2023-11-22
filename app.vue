<script setup lang="ts">
</script>
<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
<style>
/* width */
::-webkit-scrollbar {
  @apply w-2.5 h-2.5
}

/* Track */
::-webkit-scrollbar-track {
  @apply bg-white
}

/* Handle */
::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400
}
</style>
