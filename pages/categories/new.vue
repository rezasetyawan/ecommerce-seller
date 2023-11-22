<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { nanoid } from 'nanoid';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

interface Category {
    id: string;
    name: string
}
const category = ref<Category>({
    id: nanoid(16),
    name: ''
})

const { $toast } = useNuxtApp();
const isLoading = ref(false)

const addNewCategory = async () => {
    try {
        isLoading.value = true
        await useFetch('/api/categories', {
            method: 'POST',
            body: category.value
        })

        category.value = {
            id: nanoid(16),
            name: ''
        }
    } catch (error: any) {
        throw new Error(error.message)
    } finally {
        isLoading.value = false
    }
}

const onSubmitHandler = async () => {
    return $toast.promise(addNewCategory, {
        loading: "Loading...",
        success: (data) => {
            return `Category added`;
        },
        error: (data: any) => (data.message ? `${data.message}` : "Failed to create category"),
    });
}

useHead({
  title: `New Category | Ini Toko`,
  titleTemplate: `New Category | Ini Toko`,
})

definePageMeta({
    layout: 'my-layout',
    middleware: 'seller'
})
</script>
<template>
    <Toaster position="top-center" richColors />
    <div class="my-3 max-auto">
        <NuxtLink :to="'/categories'" class="p-3 flex items-center gap-1 text-sm lg:text-base">
            <ArrowLeft />
            <p>Add category</p>
        </NuxtLink>
    </div>
    <section class="px-5 max-w-sm mx-auto relative sm:py-10">
        
        <form @submit.prevent="onSubmitHandler">
            <Input v-model="category.name" />
            <div class="flex justify-end mt-2">
                <Button size="sm" class="text-xs lg:text-sm" type="submit" :disabled="isLoading">Create</Button>
            </div>
        </form>
    </section>
</template>