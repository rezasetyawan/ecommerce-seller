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

const { data } = await useFetch('/api/categories/' + categoryId.value)
const categoryApiResponse = data.value as CategoryApiResponse
category.value = categoryApiResponse.data as Category

const onSubmitHandler = async () => {
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

definePageMeta({
    layout: 'my-layout'
})
</script>
<template>
    <!-- TODO: improve ux while update category -->
    <section v-if="category" class="px-5 max-w-sm mx-auto relative sm:py-10">
        <div class="my-3 sm:absolute -left-14 top-8 w-min">
            <NuxtLink :to="'/categories'" class="p-3">
                <ArrowLeft />
            </NuxtLink>
        </div>
        <form @submit.prevent="onSubmitHandler">
            <Input v-model="category.name" />
            <div class="flex justify-end mt-2">
                <Button size="sm" class="text-xs lg:text-sm" type="submit" :disabled="isLoading">Update</Button>
            </div>
        </form>
    </section>
</template>