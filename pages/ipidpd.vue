<!-- <script setup lang="ts">
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "../types";
const products = ref<Product[] | null>();

const { data, error, pending, refresh } = useFetch("/api/products", {
  key: "products",
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
  <Table class="w-fit mx-auto">
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]"> No </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Stocks</TableHead>
        <TableHead class="text-right"> Description </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(product, index) in products" :key="product.id">
        <TableCell class="font-medium">
          {{ index + 1 }}
        </TableCell>
        <TableCell>{{ product.name }}</TableCell>
        <TableCell>{{ toRupiah(product.price) }}</TableCell>
        <TableCell>{{ product.stocks }}</TableCell>
        <TableCell>{{ product.description }}</TableCell>
        <TableCell class="text-right">
          dd
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="h-8 w-8 p-0">
                <span class="sr-only">Open menu</span>
                :
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem @click="copy(product.id.toString())">
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu></TableCell
        >
      </TableRow>
    </TableBody>
  </Table>
</template> -->
<template><div class="dark:text-white"></div></template>
