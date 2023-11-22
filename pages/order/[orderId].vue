<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { OrderDetail } from "~/types";
import { formatDate, getStatusMessage, toRupiah } from "~/utils";

interface ApiResponse {
  data: OrderDetail;
}

const route = useRoute();
const orderId = ref(route.params.orderId as string);
const order = ref<OrderDetail>();
const { data } = await useFetch("/api/orders/" + orderId.value);
const apiResponse = data.value as ApiResponse;
order.value = apiResponse.data;

if (!apiResponse.data) {
  throw createError({
    statusCode: 404,
    data: "Sorry we couldn't find your order",
    statusMessage: 'Order Not Found',
    fatal: true
  })
}

useHead({
  title: `${order.value.address.name}'s order | Ini Toko`,
  titleTemplate: `${order.value.address.name}'s order | Ini Toko`,
})

definePageMeta({
  layout: 'my-layout',
  middleware: 'seller'
})
</script>
<template>
  <div class="mx-1 sm:mx-10 md:mx-2 md:absolute lg:mx-48">
    <NuxtLink :to="'/order-list'" class="md:p-3 w-fit block">
      <ArrowLeft />
    </NuxtLink>
  </div>
  <section v-if="order" class="md:my-3 mx-1 sm:mx-10 lg:my-10 lg:mx-60">
    <div class="p-3 lg:px-10 rounded-lg shadow-md">
      <div class="space-y-2">
        <p class="font-medium bg-slate-100 p-2 text-xs rounded-md w-fit lg:text-sm">
          {{ getStatusMessage(order.status) }}
        </p>
        <p class="font-medium text-black/90 text-sm lg:text-base">
          Order date:
          <span class="ml-2 text-black">{{
            formatDate(order.created_at)
          }}</span>
        </p>
      </div>
      <div class="flex gap-10 my-4">
        <div class="w-full space-y-3">
          <template v-for="item in order.order_items" :key="item.id">
            <div class="flex gap-3 items-center shadow-sm border p-1.5 rounded-lg lg:p-3">
              <NuxtImg :src="item.image_url ? item.image_url : ''" class="w-14 lg:w-20" />
              <div class="w-full">
                <h2 class="text-sm font-semibold lg:text-base">
                  <NuxtLink :to="'/product/' + item.slug">{{
                    item.name
                  }}</NuxtLink>
                </h2>
                <p class="font-medium text-xs lg:text-sm">{{ item.variant }}</p>
                <p class="text-black/70 font-medium text-xs lg:text-sm">
                  {{ item.quantity }} products x {{ toRupiah(item.price) }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="my-10 text-sm">
        <p class="font-medium text-base lg:text-lg">Shipping Info</p>
        <div class="space-y-3 mt-2">
          <div class="flex item-center gap-3 text-sm">
            <p class="w-20 lg:w-40">Courier</p>
            <p>: {{ order.shipment.service }}</p>
          </div>
          <div class="flex item-center gap-3 text-sm">
            <p class="w-20 lg:w-40">Receipt Number</p>
            <p>: {{ order.shipment.receipt_number }}</p>
          </div>
          <div class="flex item-center gap-3 text-sm">
            <p class="w-20 lg:w-40">Shipping Address</p>
            :
            <div class="space-y-2">
              <p><span class="font-semibold">{{ order.address.name }}</span></p>
              <p class="">{{ order.address.phone_number }}</p>
              <div class="flex flex-col sm:flex-row">
                <p>{{ order.address.full_address }},</p>
                <p>{{ order.address.district }}, {{ order.address.city }},</p>
                <p>{{ order.address.province }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="my-10 text-sm space-y-3">
        <p class="font-medium text-base lg:text-lg">Payment Details</p>
        <div class="text-sm lg:text-base">
          <div class="flex justify-between">
            <p class="text-slate-600">Subtotal</p>
            <p>{{ toRupiah(order.subtotal) }}</p>
          </div>
          <div class="flex justify-between">
            <p class="text-slate-600">Shipment Fee</p>
            <p>{{ toRupiah(order.shipment.shipment_fee) }}</p>
          </div>
        </div>
        <div class="flex justify-between font-medium border-t-2 border-dashed pt-3 text-sm lg:text-base">
          <p>Total</p>
          <p>{{ toRupiah(order.shipment.shipment_fee) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
