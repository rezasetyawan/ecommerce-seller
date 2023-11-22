<script setup lang="ts">
import { Input } from '~/components/ui/input';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
interface Category {
    id: string;
    name: string
}
interface CategoryApiResponse {
    data: Category | {}
}

const route = useRoute()
const categoryId = ref(route.params.categoryId as string)
const category = ref<Category>()
const isLoading = ref(false)
const { $toast } = useNuxtApp();

const { data } = await useFetch('/api/categories/' + categoryId.value)
const categoryApiResponse = data.value as CategoryApiResponse
category.value = categoryApiResponse.data as Category

if (!categoryApiResponse.data) {
  throw createError({
    statusCode: 404,
    data: "Sorry we couldn't find your category",
    statusMessage: 'Category Not Found',
    fatal: true
  })
}

const editCategory = async () => {
    try {
        isLoading.value = true
        await useFetch('/api/categories/' + categoryId.value, {
            method: 'PUT',
            body: { name: category.value?.name }
        })
        isLoading.value = false
    } catch (error) {
        console.error(error)
    }
}

const onSubmitHandler = async () => {
    return $toast.promise(editCategory, {
        loading: "Loading...",
        success: (data) => {
            return `Category updated`;
        },
        error: (data: any) => (data.message ? `${data.message}` : "Failed to update category"),
    });
}

useHead({
  title: `${category.value.name} category | Ini Toko`,
  titleTemplate: `${category.value.name} category | Ini Toko`,
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
            <p>Edit category</p>
        </NuxtLink>
    </div>
    <section v-if="category" class="px-5 max-w-sm mx-auto relative sm:py-10">
        <form @submit.prevent="onSubmitHandler">
            <Input v-model="category.name" />
            <div class="flex justify-end mt-2">
                <Button size="sm" class="text-xs lg:text-sm" type="submit" :disabled="isLoading">Update</Button>
            </div>
        </form>
    </section>
</template>