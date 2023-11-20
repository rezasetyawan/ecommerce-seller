<script setup lang="ts">
import { Button } from '~/components/ui/button';
import Header from '~/components/elements/Header.vue'

defineProps(['error'])
</script>
<template>
    <Header/>
    <section class="w-full md:flex justify-center gap-10 p-3 font-rubik mt-14" v-if="error.statusCode === 404">
        <img :src="'/img/not-found.jpg'" class="block w-full md:w-2/5" />
        <div class="flex items-center">
            <div>
                <h2 class="text-xl font-semibold lg:text-3xl">{{ error.statusMessage }}</h2>
                <p class="text-sm lg:text-base">{{ error.data ? error.data : "Sorry we couldn't find your desired page" }}</p>
                <Button class="mt-4">
                    <NuxtLink :to="'/'">Back to home</NuxtLink>
                </Button>
            </div>
        </div>
    </section>
    <section v-else class="flex flex-col justify-center mx-5 items-center h-[80vh]">
        <NuxtLink :src="'/images/error.jpg'" class="block w-4/5 md:w-2/5" />
        <h2 class="text-lg font-semibold lg:text-3xl font-rubik text-justify"> {{ error.message }}</h2>
        <p class="text-sm lg:text-base">Sorry we have some problem with our service</p>
    </section>
</template>