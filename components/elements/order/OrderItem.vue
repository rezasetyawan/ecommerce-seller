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
      <p class="font-medium">{{ formatDate(order.created_at) }}</p>
      <p class="font-medium bg-slate-50 p-2 text-xs rounded-md">
        {{ getStatusMessage(order.status) }}
      </p>
    </div>
    <div class="flex gap-10 mt-4">
      <div class="w-full space-y-3">
        <template v-for="item in order.order_items" :key="item.id">
          <div class="flex gap-3 items-center">
            <!-- <img :src="item.image_url" class="w-20" /> -->
            <div class="w-full">
              <h2 class="text-lg font-semibold">{{ item.name }}</h2>
              <p class="font-medium text-sm">{{ item.variant }}</p>
              <p class="text-black/70 font-medium text-sm">
                {{ item.quantity }} products x {{ toRupiah(item.price) }}
              </p>
            </div>
          </div>
        </template>
      </div>
      <div class="w-full self-end">
        <p>Subtotal</p>
        <p class="font-medium">{{ toRupiah(order.total) }}</p>
      </div>
    </div>
    <div class="flex justify-end">
      <div
        v-if="order.status === 'PENDING' || order.status === 'CANCELLED'"
        class="flex gap-2"
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <Button class="px-10" variant="destructive"
              >Decline</Button
            ></AlertDialogTrigger
          >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will decline the order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction @click="() => emit('decline', order.id)"
                >Continue</AlertDialogAction
              >
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button class="px-10" @click="() => emit('accept', order.id)"
          >Accept</Button
        >
      </div>
      <div v-if="order.status === 'ONPROCESS'" class="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button class="px-10" variant="destructive"
              >CANCEL</Button
            ></AlertDialogTrigger
          >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel the order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction @click="() => emit('decline', order.id)"
                >Continue</AlertDialogAction
              >
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog>
          <DialogTrigger> <Button class="px-10">SEND</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle class="text-sm">Receipt Number</DialogTitle>
              <form
                class="mt-3 space-y-4"
                @submit.prevent="
                  () =>
                    emit('send', {
                      orderId: order.id,
                      receiptNumber: receiptNumber,
                    })
                "
              >
                <Input type="text" v-model="receiptNumber" />
                <div class="flex justify-end">
                  <Button class="px-10" type="submit">Send</Button>
                </div>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>
</template>
