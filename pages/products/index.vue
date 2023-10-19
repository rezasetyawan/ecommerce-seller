<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Product } from "../../types";
const products = ref<Product[] | null>();

const { data, error, pending, refresh } = await useFetch("/api/products/info", {
  key: "products",
  method: "get",
});

products.value = data.value?.data as Product[];
console.log(products.value);

function copy(id: string) {
  navigator.clipboard.writeText(id);
}

const toRupiah = (price: number) => {
  return "Rp. " + price.toLocaleString("id-ID");
};
</script>
<template>
  <section class="p-14">
    <div class="flex justify-end">
      <Button class="my-3"
        ><NuxtLink to="/products/new">Add Product</NuxtLink></Button
      >
    </div>
    <Table class="mx-auto border rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stocks</TableHead>
          <TableHead>Sold</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(product, index) in products" :key="product.id">
          <TableCell class="font-medium">
            {{ index + 1 }}
          </TableCell>
          <TableCell
            ><NuxtLink :to="'/products/' + product.id">{{
              product.name
            }}</NuxtLink></TableCell
          >
          <TableCell>{{
            product.price ? toRupiah(product.price) : "-"
          }}</TableCell>
          <TableCell>{{ product.stocks }}</TableCell>
          <TableCell>{{ product.sold }}</TableCell>
          <TableCell>
            {{ product.category }}
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="h-8 w-8 p-0">
                  <span class="sr-only">Open menu</span>
                  :
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem> Edit </DropdownMenuItem>
                <!-- <DropdownMenuSeparator /> -->
                <DropdownMenuItem>Delete</DropdownMenuItem>
                <DropdownMenuItem
                  ><NuxtLink :to="'/products/' + product.id"
                    >View Detail</NuxtLink
                  ></DropdownMenuItem
                >
              </DropdownMenuContent>
            </DropdownMenu></TableCell
          >
        </TableRow>
      </TableBody>
    </Table>
  </section>
</template>
