
<script setup lang="ts">
import { useSupabaseClient } from "../node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import Overview from '~/components/elements/Overview.vue'
import { getProductCounts } from "~/utils/useProduct";
import { getTotalRevenue, getTotalRevenueEveryMonth } from "~/utils/getTotallRevenue";
import { toRupiah } from "~/utils";
import { ScrollArea } from '~/components/ui/scroll-area'

const supabase = useSupabaseClient()
const totalRevenue = ref(0)
totalRevenue.value = await getTotalRevenue(supabase)
const productCounts = ref(0)
productCounts.value = await getProductCounts(supabase)


interface PopularProduct {
    variant_id: string
    sold: number
    variant: string
    product_id: string
    name: string
    slug: string
    image_url: string
}

interface PopularProductsResponse {
    data: PopularProduct[]
}


const { data } = await useFetch('/api/popular-products')
const popularProductsResponse = data.value as PopularProductsResponse
const popularProducts = ref<PopularProduct[]>([])
popularProducts.value = popularProductsResponse.data

const revenueGraph = ref<{ name: string, total: number }[]>([])
revenueGraph.value = [
    { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
]

definePageMeta({
    layout: 'my-layout',
    middleware: 'seller'
})
</script>
<template>
    <section class="mx-3 lg:mx-20">
        <h2 class="font-semibold text-lg lg:text-2xl">Dashboard</h2>
        <div class="flex gap-5 mt-5">
            <div class="p-3 rounded-lg shadow-sm border w-full space-y-2">
                <h2 class="font-medium text-sm lg:text-base">Total Revenue</h2>
                <p class="text-base font-semibold lg:text-xl">{{toRupiah( totalRevenue)}}</p>
            </div>
            <div class="p-3 rounded-lg shadow-sm border w-full space-y-2">
                <h2 class="font-medium text-sm lg:text-base">Total Product</h2>
                <p class="text-base font-semibold lg:text-xl">{{ productCounts }}</p>
            </div>
        </div>
    </section>
    <section class="mx-3 lg:mx-20 mt-10 md:grid  grid-cols-3 border rounded-lg p-3 shadow-sm mb-10">
        <div class="col-span-2">
            <h2 class="text-base font-semibold lg:text-lg">Overview</h2>
            <ClientOnly>
                <Overview :data="revenueGraph" class="mt-4" />
            </ClientOnly>
        </div>
        <div class="rounded-lg col-span-1 max-md:mt-6">
            <h2 class="text-base font-semibold lg:text-lg">Most Selled Products</h2>
            <ScrollArea class="h-[300px] space-y-2 lg:pr-4">
                <template v-for="product in popularProducts" :key="product.variant_id">
                    <div class="flex gap-3 items-center shadow-sm border  p-1.5 mb-2 rounded-lg">
                        <img :src="product.image_url" class="w-14 lg:w-20" />
                        <div class="w-full">
                            <h2 class="text-sm font-semibold truncate">
                                <NuxtLink :to="'/product/' + product.slug">{{
                                    product.name
                                }}</NuxtLink>
                            </h2>
                            <p class="font-medium text-xs lg:text-sm">Variant: {{ product.variant }}</p>
                            <p class="text-black/70 font-medium text-xs lg:text-sm">
                                Sold: {{ product.sold }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-3 items-center shadow-sm border  p-1.5 mb-2 rounded-lg">
                        <img :src="product.image_url" class="w-14 lg:w-20" />
                        <div class="w-full">
                            <h2 class="text-sm font-semibold truncate">
                                <NuxtLink :to="'/product/' + product.slug">{{
                                    product.name
                                }}</NuxtLink>
                            </h2>
                            <p class="font-medium text-xs lg:text-sm">Variant: {{ product.variant }}</p>
                            <p class="text-black/70 font-medium text-xs lg:text-sm">
                                Sold: {{ product.sold }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-3 items-center shadow-sm border  p-1.5 mb-2 rounded-lg">
                        <img :src="product.image_url" class="w-14 lg:w-20" />
                        <div class="w-full">
                            <h2 class="text-sm font-semibold truncate">
                                <NuxtLink :to="'/product/' + product.slug">{{
                                    product.name
                                }}</NuxtLink>
                            </h2>
                            <p class="font-medium text-xs lg:text-sm">Variant: {{ product.variant }}</p>
                            <p class="text-black/70 font-medium text-xs lg:text-sm">
                                Sold: {{ product.sold }}
                            </p>
                        </div>
                    </div>
                    <div class="flex gap-3 items-center shadow-sm border  p-1.5 mb-2 rounded-lg">
                        <img :src="product.image_url" class="w-14 lg:w-20" />
                        <div class="w-full">
                            <h2 class="text-sm font-semibold truncate">
                                <NuxtLink :to="'/product/' + product.slug">{{
                                    product.name
                                }}</NuxtLink>
                            </h2>
                            <p class="font-medium text-xs lg:text-sm">Variant: {{ product.variant }}</p>
                            <p class="text-black/70 font-medium text-xs lg:text-sm">
                                Sold: {{ product.sold }}
                            </p>
                        </div>
                    </div>
                </template>
            </ScrollArea>
        </div>
    </section>
</template>