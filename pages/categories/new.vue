<script setup lang="ts">
import { Input } from '~/components/ui/input';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
import { nanoid } from 'nanoid';

interface Category {
    id: string;
    name: string
}
const category = ref<Category>({
    id: nanoid(16),
    name: ''
})

const isLoading = ref(false)

const onSubmitHandler = async () => {
    try {
        // TODO: REPLACE CATEGORY WITH NEW DEFAULT VALUE (THE ID), BECAUSE IF USER WANT TO ADD MULTIPLE CATEGORY IT WILL THROW ERROR BECAUSE MAYBED IT WILL USE SAME ID AS PREVIOUSE ONE
        isLoading.value = true
        await useFetch('/api/categories', {
            method: 'POST',
            body: category.value
        })

        category.value = {
            id: nanoid(16),
            name: ''
        }

        isLoading.value = false
    } catch (error) {
        console.error(error)
    }
}

definePageMeta({
    layout: 'my-layout'
})
</script>
<template>
    <!-- TODO: improve ux while add category kaya divideo bang fuid -->
    <section class="px-5 max-w-sm mx-auto relative sm:py-10">
        <div class="my-3 sm:absolute -left-14 top-8 w-min">
            <NuxtLink :to="'/categories'" class="m-0 p-0">
                <ArrowLeft />
            </NuxtLink>
        </div>
        <form @submit.prevent="onSubmitHandler">
            <Input v-model="category.name" />
            <div class="flex justify-end mt-2">
                <Button size="sm" class="text-xs lg:text-sm" type="submit" :disabled="isLoading">Create</Button>
            </div>
        </form>
    </section>
</template>