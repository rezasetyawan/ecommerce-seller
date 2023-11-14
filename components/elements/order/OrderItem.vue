<script setup lang="ts">
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import { ref, toRefs } from "vue";
import { Order } from "~/types";
import { Input } from "../../ui/input";

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
} from "../../ui/alert-dialog";

interface Props {
  order: Order;
}

const props = defineProps<Props>();
const emit = defineEmits(["accept", "decline", "send"]);

const { order } = toRefs(props);
const toRupiah = (price: number) => {
  return "Rp. " + price.toLocaleString("id-ID");
};

const formatDate = (millisecondsTimestamp: string): string => {
  const dateObject = new Date(parseInt(millisecondsTimestamp));
  const options: object = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  const formattedDate = dateObject.toLocaleString(undefined, options);
  return formattedDate;
};

const receiptNumber = ref("");

const getStatusMessage = (status: string) => {
  let statusMessage: string = "";

  switch (status) {
    case "PENDING":
      statusMessage = "Waiting confirmation.";
      break;
    case "PAYMENT":
      statusMessage = "Payment";
      break;
    case "ONPROCESS":
      statusMessage = "Onprocess";
      break;
    case "SHIPPING":
      statusMessage = "Shipping";
      break;
    case "CANCELLED":
      statusMessage = "Cancelled";
      break;
    case "FINISHED":
      statusMessage = "Finished";
      break;
    default:
      statusMessage = "Invalid status.";
  }

  return statusMessage;
};
</script>
<template>
  <div class="p-3 rounded-lg shadow-md">
    <div class="flex gap-3 items-center">
      <p class="font-medium text-xs whitespace-nowrap lg:text-base">{{ formatDate(order.created_at) }}</p>
      <p class="font-medium bg-slate-50 p-2 text-xs rounded-md whitespace-nowrap">
        {{ getStatusMessage(order.status) }}
      </p>
    </div>
    <div class="gap-10 mt-4 md:flex">
      <div class="w-full space-y-2 lg:space-y-3">
        <template v-for="item in order.order_items" :key="item.id">
          <div class="flex gap-3 items-center">
            <img :src="item.image_url" class="w-14 lg:w-20" />
            <div class="w-full">
              <h2 class="text-sm font-semibold truncate lg:text-base">
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
      <div class="w-full self-end items-center text-xs justify-between mt-2 sm:flex lg:text-base">
        <div>
          <p>Total</p>
          <p class="font-medium">{{ toRupiah(order.total) }}</p>
        </div>

        <!-- actions button -->
        <div class="flex justify-end gap-2 max-sm:mt-1">
          <NuxtLink :to="'/order/' + order.id">
          <Button variant="link" class="whitespace-nowrap text-xs lg:text-sm" size="xs">
            See detail
          </Button>
        </NuxtLink>
          <div v-if="order.status === 'PENDING' || order.status === 'CANCELLED'" class="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button class="text-xs whitespace-nowrap lg:text-sm" variant="destructive" size="xs">Decline</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will decline the order.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="() => emit('decline', order.id)">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button class="whitespace-nowrap text-xs lg:text-sm" size="xs" @click="() => emit('accept', order.id)">Accept</Button>
          </div>
          <div v-if="order.status === 'ONPROCESS'" class="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button class="text-xs whitespace-nowrap lg:text-sm" variant="destructive" size="xs">Cancel</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel the order.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="() => emit('decline', order.id)">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog>
              <DialogTrigger> <Button class="whitespace-nowrap text-xs lg:text-sm" size="xs">Send</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle class="text-sm">Receipt Number</DialogTitle>
                  <form class="mt-3 space-y-4" @submit.prevent="() =>
                    emit('send', {
                      orderId: order.id,
                      receiptNumber: receiptNumber,
                    })
                    ">
                    <Input type="text" v-model="receiptNumber" />
                    <div class="flex justify-end">
                      <Button class="text-xs lg:text-sm" type="submit" size="xs">Send</Button>
                    </div>
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <!-- end of actions button -->
      </div>
    </div>
  </div>
</template>
