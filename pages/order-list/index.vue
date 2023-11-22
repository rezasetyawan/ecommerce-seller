<script setup lang="ts">
import OrderItem from "~/components/elements/order/OrderItem.vue";
import { useSupabaseClient } from "~/node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { Order } from '~/types';
import { updateOrderReceipt, updateOrderStatus } from "~/utils/useOrder";

interface ApiResponse {
  data: {
    orders: Order[];
  };
}

const { $toast } = useNuxtApp();
const supabase = useSupabaseClient();
const orders = ref<Order[]>([]);

const { data } = await useFetch("/api/orders");
const orderData = data.value as ApiResponse;
orders.value = orderData.data.orders;

const getOrderItemIndex = (orderId: string) => {
  const index = orders.value.findIndex((order) => order.id === orderId);
  return index;
};

const declineOrderHandler = async (orderId: string) => {
  try {
    await updateOrderStatus(supabase, orderId, "CANCELLED");
    const index = getOrderItemIndex(orderId);

    index !== -1 ? (orders.value[index].status = "CANCELLED") : null;
    return $toast.success('Order cancelled')
  } catch (error: any) {
    return $toast.error(error.message ? `${error.message}` : "Failed to decline order")
  }
};

const acceptOrderHandler = async (orderId: string) => {
  try {
    await updateOrderStatus(supabase, orderId, "PAYMENT");
    const index = getOrderItemIndex(orderId);

    index !== -1 ? (orders.value[index].status = "PAYMENT") : null;
    return $toast.success('Order accepted')
  } catch (error: any) {
    return $toast.error(error.message ? `${error.message}` : "Failed to accept order")
  }
};

const sendOrderHandler = async (orderId: string, receiptNumber: string) => {
  try {
    await updateOrderReceipt(supabase, orderId, receiptNumber);
    const index = getOrderItemIndex(orderId);

    index !== -1 ? (orders.value[index].status = "SHIPPING") : null;
    return $toast.success('Order sent')
  } catch (error: any) {
    return $toast.error(error.message ? `${error.message}` : "Failed to send order")
  }
};

interface sendReturnData {
  orderId: string;
  receiptNumber: string;
}

useHead({
  title: `Customer orders | Ini Toko`,
  titleTemplate: `Customer orders | Ini Toko`,
})

definePageMeta({
  layout: 'my-layout',
  middleware: 'seller'
})
</script>
<template>
  <Toaster position="top-center" richColors />
  <section class="m-5 lg:mx-20 lg:my-10 lg:pt-5 space-y-2">
    <template v-for="order in orders" :key="order.id">
      <OrderItem :order="order" @accept="(id: string) => acceptOrderHandler(id)"
        @decline="(id: string) => declineOrderHandler(id)"
        @send="(data: sendReturnData) => sendOrderHandler(data.orderId, data.receiptNumber)" />
    </template>
  </section>
</template>
