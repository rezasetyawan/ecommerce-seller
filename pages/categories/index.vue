<script setup lang="ts">
import { Search } from "lucide-vue-next";
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
import { Button } from "~/components/ui/button";
import {
Popover,
PopoverContent,
PopoverTrigger,
} from '~/components/ui/popover';
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "~/components/ui/table";

interface Category {
    id: string;
    name: string
}
interface CategoriesApiResponse {
    data: Category[] | []
}

const { $toast } = useNuxtApp()
const categories = ref<Category[]>([])
const searchKey = ref("")
const cacheKey = ref("categories")
const router = useRouter()
const route = useRoute()

searchKey.value = route.query.search ? route.query.search as string : ''

const getCategoryIndex = (id: string) => {
    const index = categories.value.findIndex((category) => category.id === id);
    return index;
};

const getCategories = async () => {
    try {
        const { data: categoriesCache } = useNuxtData(cacheKey.value)
        if (categoriesCache.value?.data) {
            categories.value = categoriesCache.value.data
            return
        }
        const { data } = await useFetch("/api/categories", {
            method: "GET",
            key: cacheKey.value,
            query: {
                search: searchKey.value
            }
        });

        const categoriesApiResponse = data.value as CategoriesApiResponse;
        categories.value = categoriesApiResponse.data;
        return
    } catch (error: any) {
        return $toast.error(error.message ? `${error.message}` : "Failed to fetch categories")
    }
}

const deleteCategoryHandler = async (id: string) => {
    try {
        await useFetch('/api/categories/' + id, {
            method: 'DELETE',
        })

        const index = getCategoryIndex(id)
        index !== -1 ? categories.value.splice(index, 1) : null;

        return $toast.success('Category deleted')
    } catch (error: any) {
        return $toast.error(error.message ? `${error.message}` : "Failed to fetch categories")
    }
}

onBeforeRouteUpdate(async (to, from) => {
    if (to.fullPath === '/categories?search=' || to.fullPath === '/products') {
        cacheKey.value = 'categories'
        await getCategories()
        return
    }

    searchKey.value = to.query.search as string
    cacheKey.value = to.fullPath
    await getCategories()
});

onMounted(async () => {
    await getCategories()
})

const onSearhSubmitHandler = () => {
    router.push({ name: "categories", query: { search: searchKey.value } });
}

useHead({
  title: `Categories | Ini Toko`,
  titleTemplate: `Categories | Ini Toko`,
})

definePageMeta({
    layout: 'my-layout',
    middleware: 'seller'
})
</script>
<template>
    <Toaster position="top-center" richColors />
    <section class="mx-5 py-5 sm:mx-20 lg:mx-40 xl:mx-60">
        <div class="flex justify-between items-center gap-3">
            <form @submit.prevent="onSearhSubmitHandler"
                class="flex items-center px-3 h-10 py-2 bg-slate-50 rounded-lg lg:min-w-[24rem]">
                <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                    class="flex w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-sm"
                    placeholder="Search categories..." v-model="searchKey" />
            </form>
            <div class="flex my-2 justify-end">
                <NuxtLink :to="'/categories/new'">
                    <Button size="sm" class="text-xs lg:text-sm">Add Category</Button>
                </NuxtLink>
            </div>
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