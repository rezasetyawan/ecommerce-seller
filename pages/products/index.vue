<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { Filter, Search, Loader2 } from "lucide-vue-next";
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
import { toRupiah } from "~/utils";
import { deleteProduct } from "~/utils/useProduct";
import { Button } from "../../components/ui/button";
import { useSupabaseClient } from "../../node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { Category, Product } from "../../types";
interface ProductSuggestionResponse {
  data: { name: string; slug: string }[];
}

interface CategoriesApiResponse {
  data: Category[];
}

const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()
const products = ref<Product[] | null>();
const cacheKey = ref("/products")
const queryParams = ref({
  search: route.query.search ? route.query.search as string : '',
  category: route.query.category ? route.query.category as string : ''
})
const isLoading = ref(false)

const productSuggestions = ref<{ name: string; slug: string }[]>([]);
const productSuggestionsLoading = ref(false);
const showProductSuggestions = ref(false);
const { $toast } = useNuxtApp()

const categories = ref<Category[]>([])

const getProducts = async () => {
  try {
    isLoading.value = true
    // DISABLE CACHING, IDK WHY THERE'S BUG ON IT
    // const { data: productsCache } = useNuxtData(cacheKey.value)
    
    // clearNuxtData('/products?search=test&category=')
    // clearNuxtData('/products?search=TEST&category=')
    // console.log(queryParams.value)
    // console.log(cacheKey.value)
    // if (productsCache.value?.data) {
    //   console.log('not fetch egen')
    //   products.value = productsCache.value.data
    //   return
    // }

    // console.log('fetch egen')

    const { data } = await useFetch("/api/products/info", {
      key: cacheKey.value,
      query: queryParams.value
    });

    products.value = data.value?.data as Product[];
    if (products.value) {
      return
    } else {
      await getProducts()
    }
  } catch (error: any) {
    return $toast.error(error.message ? `${error.message}` : "Failed to fetch product")
  } finally {
    isLoading.value = false
  }
}

const getCategories = async () => {
  try {
    const { data: categoriesCache } = useNuxtData('categories')
    if (categoriesCache.value?.data) {
      categories.value = categoriesCache.value.data
      return
    }
    const { data } = await useFetch("/api/categories", {
      method: "GET",
      key: 'categories'
    });

    const categoriesApiResponse = data.value as CategoriesApiResponse;
    categories.value = categoriesApiResponse.data;
    return
  } catch (error: any) {
    return $toast.error(error.message ? `${error.message}` : "Failed to fetch categories")
  }
}

// for search auto complete
const getProductSuggestions = useDebounceFn(
  async () => {
    try {
      const { data } = await useFetch("/api/product-suggestions", {
        query: {
          search: queryParams.value.search
        },
      });
      productSuggestionsLoading.value = false;
      const suggestionData = data.value as ProductSuggestionResponse;
      productSuggestions.value = suggestionData.data;
    } catch (err) { }
  },
  1000,
  {
    maxWait: 5000,
  }
);

const hideProductSuggetions = useDebounceFn(() => {
  showProductSuggestions.value = false;
}, 150);

const onSearchSubmit = () => {
  router.push({ name: "products", query: queryParams.value });
  showProductSuggestions.value = false;
};


const getProductItemIndex = (productId: string) => {
  if (!products.value) return -1
  const index = products.value.findIndex((product) => product.id === productId);
  return index;
}

const deleteProductHandler = async (productId: string) => {
  try {
    await deleteProduct(supabase, productId)
    const index = getProductItemIndex(productId);

    index !== -1 ? products.value?.splice(index, 1) : null;
    return $toast.success('Product deleted')
  } catch (error: any) {
    return $toast.error(error.message ? `${error.message}` : "Failed to delete product")
  }
}

onMounted(async () => {
  cacheKey.value = route.fullPath
  await getProducts()
  await getCategories()
})

onBeforeRouteUpdate(async (to, from) => {
  if (to.fullPath === '/products?search=' || to.fullPath === '/products?category=' || to.fullPath === '/products?search=&category=') {
    cacheKey.value = '/products'
    await getProducts();
    return
  }

  queryParams.value.search = to.query.search as string
  queryParams.value.category = to.query.category as string
  cacheKey.value = to.fullPath
  await getProducts()
});

const onChoseCategorySubmit = () => {
  router.push({ name: "products", query: queryParams.value });
};

useHead({
  title: `Products | Ini Toko`,
  titleTemplate: `Products | Ini Toko`,
})

definePageMeta({
  layout: 'my-layout',
  middleware: 'seller'
})
</script>
<template>
  <section class="m-3 md:m-10 md:mx-20">
    <div class="md:flex justify-between pt-4">
      <div class="relative flex items-center gap-2 mb-2">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="secondary" class="block">
              <Filter class="stroke-slate-800 w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle class="font-semibold">Choose Category</AlertDialogTitle>
              <AlertDialogDescription>
                <div class="flex flex-wrap max-w-[300px] gap-0.5">
                  <label v-for="item in categories" :key="item.id"
                    class="border-2 border-slate-100 px-[0.8em] py-[0.4em] rounded-md hover:cursor-pointer text-sm"
                    :class="{ 'checked-label': item.id === queryParams.category }">
                    <input type="radio" v-model="queryParams.category" :value="item.id" class="w-full h-full hidden" />
                    {{ item.name }}
                  </label>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction @click="() => {
                queryParams.category = ''
                queryParams.search = ''
                onChoseCategorySubmit()
              }">Reset</AlertDialogAction>
              <AlertDialogAction @click="onChoseCategorySubmit">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <form @submit.prevent="onSearchSubmit"
          class="flex items-center px-3 h-10 py-2 bg-slate-50 rounded-lg lg:min-w-[24rem]">
          <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            class="flex w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-sm"
            placeholder="Search products..." v-model="queryParams.search" @input="() => {
              productSuggestions = [];
              productSuggestionsLoading = true;
              getProductSuggestions();
            }
              " @keyup.enter="onSearchSubmit" @focus="showProductSuggestions = true" @blur="hideProductSuggetions" />
        </form>
        <div class="absolute bg-white w-60 shadow-sm rounded-lg top-14 p-3 border z-[2000] text-sm md:w-96"
          v-show="showProductSuggestions">

          <template v-for="product in productSuggestions" :key="product.slug">
            <NuxtLink :to="'/product/' + product.slug" class="block mt-1">{{ product.name }}</NuxtLink>
          </template>

          <div class="flex items-center justify-center" v-show="productSuggestionsLoading">
            <!-- <svg aria-hidden="true" class="w-6 h-6 text-primary/40 transition animate-spin duration-800 fill-primary"
              viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg> -->
            <Loader2 class="stroke-black/40 animate-spin w-6 h-6"/>
          </div>
        </div>


      </div>
      <NuxtLink to="/products/new">
        <Button class="my-3 text-xs lg:text-sm">
          Add Product
        </Button>
      </NuxtLink>
    </div>
    <Table class="mx-auto border rounded-lg text-xs lg:text-sm" v-if="products && !isLoading">
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stocks</TableHead>
          <TableHead>Sold</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(product, index) in products" :key="product.id">
          <TableCell class="font-medium">
            {{ index + 1 }}
          </TableCell>
          <TableCell>
            <NuxtLink :to="'/product/' + product.slug">{{
              product.name
            }}</NuxtLink>
          </TableCell>
          <TableCell>{{
            product.price ? toRupiah(product.price) : "-"
          }}</TableCell>
          <TableCell>{{ product.stocks }}</TableCell>
          <TableCell>{{ product.sold }}</TableCell>
          <TableCell>
            {{ product.category }}
          </TableCell>
          <TableCell>
            <Popover>
              <PopoverTrigger>
                Actions
              </PopoverTrigger>
              <PopoverContent class="w-max space-y-1.5">
                <div class="font-medium text-xs lg:text-sm">
                  <NuxtLink :to="'/product/edit/' + product.slug">Edit</NuxtLink>
                </div>
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger class="font-medium text-xs lg:text-sm">
                      Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will delete the <span class="font-medium">{{ product.name }}</span>, and cannot be undone
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction @click="deleteProductHandler(product.id)">Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div class="font-medium text-xs lg:text-sm">
                  <NuxtLink :to="'/product/' + product.slug">Detail</NuxtLink>
                </div>
              </PopoverContent>
            </Popover>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div v-if="!isLoading && products && !products.length" class="flex flex-col items-center justify-center">
      <NuxtImg :src="'/img/product-not-found.jpg'" class="block w-full md:w-1/3" />
      <p class="font-medium text-center text-base lg:text-lg">Product not found</p>
    </div>
    <div v-if="isLoading" class="flex h-[60vh] items-center justify-center ">
      <Loader2 class="stroke-black/40 animate-spin w-6 h-6"/>
    </div>
  </section>
</template>
<style scoped>
.checked-label {
  @apply bg-slate-100
}
</style>
