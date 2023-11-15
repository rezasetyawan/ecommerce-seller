<script setup lang="ts">
import { Button } from '~/components/ui/button';
definePageMeta({
    layout: 'my-layout',
    middleware: 'seller'
})
</script>
<template>
    <section class="w-full md:flex justify-center gap-10 p-3">
        <img :src="'/img/not-found.jpg'" class="block w-full md:w-2/5">
        <div class="flex items-center">
            <div>
                <h2 class="text-xl font-semibold lg:text-3xl">Page Not Found</h2>
                <p class="text-sm lg:text-base">Sorry we couldn't find your desired page</p>
                <Button class="mt-4"> <NuxtLink :to="'/'">Back to home</NuxtLink></Button>
            </div>
        </div>

    </section>
</template>