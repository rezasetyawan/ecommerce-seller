<script setup lang="ts">
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button"

interface Category {
    id: string;
    name: string
}
interface CategoryApiResponse {
    data: Category[] | []
}

const categories = ref<Category[]>([])

const { data } = await useFetch('/api/categories')
const categoryApiResponse = data.value as CategoryApiResponse
categories.value = categoryApiResponse.data

const getCategoryIndex = (id: string) => {
    const index = categories.value.findIndex((category) => category.id === id);
    return index;
};


const deleteCategoryHandler = async (id: string) => {
    try {
        await useFetch('/api/categories/' + id, {
            method: 'DELETE',
        })

        const index = getCategoryIndex(id)
        console.log(index)
        index !== -1 ? categories.value.splice(index, 1) : null;
    } catch (error) {
        console.error(error)
    }
}

definePageMeta({
    layout: 'my-layout'
})
</script>
<template>
    <section class="mx-5 py-5 sm:mx-20 lg:mx-40 xl:mx-60">
        <div class="flex my-2 justify-end">
            <NuxtLink :to="'/categories/new'">
                <Button size="sm" class="text-xs lg:text-sm">Add Category</Button>
            </NuxtLink>
        </div>
        <Table class="text-sm border mt-2">
            <TableHeader>
                <TableRow>
                    <TableHead>
                        No
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>

                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="(category, index) in categories" :key="category.id">
                    <TableCell class="font-medium">
                        {{ index + 1 }}
                    </TableCell>
                    <TableCell>
                        <NuxtLink :to="'/category/' + category.id">{{ category.name }}</NuxtLink>
                    </TableCell>
                    <TableCell>
                        <Popover>
                            <PopoverTrigger>
                                Actions
                            </PopoverTrigger>
                            <PopoverContent class="w-max space-y-1.5">
                                <div class="text-sm font-medium">
                                    <NuxtLink :to="'/category/' + category.id">Edit</NuxtLink>
                                </div>
                                <div>
                                    <AlertDialog>
                                        <AlertDialogTrigger class="text-sm font-medium">
                                            Delete
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will delete the <span class="font-medium">{{ category.name
                                                    }}</span> category, and delete all product with this category. Are
                                                    you really sure?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction @click="deleteCategoryHandler(category.id)">Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </section>
</template>