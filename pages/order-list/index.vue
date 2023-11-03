<script setup lang="ts">
import { useSupabaseClient } from "~/node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { updateOrderReceipt, updateOrderStatus } from "~/utils/useOrder";
import OrderItem from "~/components/elements/order/OrderItem.vue";
import { Order } from '~/types';

interface ApiResponse {
  data: {
    orders: Order[];
  };
}

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
  } catch (error) {
    console.error(error);
  }
};

const acceptOrderHandler = async (orderId: string) => {
  try {
    await updateOrderStatus(supabase, orderId, "PAYMENT");
    const index = getOrderItemIndex(orderId);

    index !== -1 ? (orders.value[index].status = "PAYMENT") : null;
  } catch (error) {
    console.error(error);
  }
};

const sendOrderHandler = async (orderId: string, receiptNumber: string) => {
  try {
    await updateOrderReceipt(supabase, orderId, receiptNumber);
    const index = getOrderItemIndex(orderId);

    index !== -1 ? (orders.value[index].status = "SHIPPING") : null;
  } catch (error) {}
};

interface sendReturnData {
  orderId: string;
  receiptNumber: string;
}

definePageMeta({
  layout: "my-layout",
});
</script>
<template>
  <section>
    <section class="mx-20 my-20 space-y-5">
      <template v-for="order in orders" :key="order.id">
        <OrderItem
          :order="order"
          @accept="(id: string) => acceptOrderHandler(id)"
          @decline="(id: string) => declineOrderHandler(id)"
          @send="(data: sendReturnData) => sendOrderHandler(data.orderId, data.receiptNumber)"
        />
      </template>
    </section>
  </section>
</template>
