<script setup lang="ts">
import { X } from "lucide-vue-next";
import { nanoid } from "nanoid";
import { addProductImage } from "~/utils/useImage";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Textarea } from "../../components/ui/textarea";
import { useSupabaseClient } from "../../node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";

interface Variant {
  id: string;
  value: string;
  price: number | undefined;
  stocks: number | undefined;
  is_default: boolean;
  product_id: string;
  weight: number | undefined;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  sold: number;
  created_at: string;
  updated_at: string;
}

const supabase = useSupabaseClient();
const config = useRuntimeConfig();

const { data: categorySnapshot } = await useFetch("/api/categories");

const categories = ref<{ id: string; name: string }[] | []>([]);

if (categorySnapshot.value) {
  categories.value = categorySnapshot.value.data;
}

const product = ref<Product>({
  id: nanoid(16),
  name: "",
  description: "",
  category_id: "",
  sold: 0,
  created_at: Date.now().toString(),
  updated_at: Date.now().toString(),
});

const variants = ref<Variant[]>([
  {
    id: nanoid(16),
    value: "",
    price: undefined,
    stocks: undefined,
    is_default: true,
    product_id: product.value.id,
    weight: undefined,
  },
]);

const images = ref<File[]>([]);

const addNewVariantHandler = () => {
  variants.value = [
    ...variants.value,
    {
      id: nanoid(16),
      value: "",
      price: undefined,
      stocks: undefined,
      is_default: false,
      product_id: product.value.id,
      weight: undefined,
    },
  ];
};

const deleteVariantHandler = (id: string) => {
  const index = variants.value?.findIndex((variant) => variant.id === id);

  if (index !== -1 && index !== undefined) {
    variants.value.splice(index, 1);
  }
};

const toRupiah = (price: number) => {
  return "Rp. " + price.toLocaleString("id-ID");
};

const onImageChangeHandler = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    for (let i = 0; i < target.files.length; i++) {
      images.value?.push(target.files[i]);
    }
  }
};

// const getImageUrls = async () => {
//   try {
//     if (images.value) {
//       for (let i = 0; i < images.value?.length; i++) {
//         const file = images.value[i];
//       }
//     }
//   } catch (error) {}
// };

const onSubmitHandler = async () => {
  try {
    const transformedVariants = variants.value.map((variant) => {
      return { ...variant, weight: variant.weight?.toString() };
    });

    const imagesUrl = await Promise.all(
      images.value.map(async (image) => {
        const url = await addProductImage(
          supabase,
          image,
          config.public.SUPABASE_URL
        );
        return url;
      })
    );

    const productImages = imagesUrl.map((url) => {
      return {
        id: nanoid(16),
        product_id: product.value.id,
        url: url,
      };
    });

    const { error } = await useFetch("/api/products", {
      method: "POST",
      body: {
        ...product.value,
        images: productImages,
        variants: transformedVariants,
      },
    });

    if (error) {
      throw new Error(error.value?.message);
    }
  } catch (error) {}
};

watch(
  variants,
  () => {
    console.log(variants.value);
  },
  { deep: true, immediate: true }
);

definePageMeta({
  layout: "my-layout",
});
</script>
<template>
  <section class="mx-20 xl:mx-48 my-20">
    <h2 class="my-8 font-semibold text-2xl text-center">Add New Product</h2>
    <form @submit.prevent="onSubmitHandler">
      <Label for="product_name">Product Name</Label>
      <Input
        type="text"
        required
        placeholder="Type here..."
        name="product_name"
        class="my-2"
        v-model="product.name"
      />

      <Label class="mt-4 mb-2">Category</Label>
      <Select v-model="product.category_id" v-if="categories" required>
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            <template v-for="category in categories" :key="category.id"
              ><SelectItem :value="category.id">{{
                category.name
              }}</SelectItem></template
            >
          </SelectGroup>
        </SelectContent>
      </Select>

      <Label class="mt-4 mb-2">Product Description</Label>
      <Textarea
        name="product_description"
        v-model="product.description"
        required
      />

      <Label for="product_images" class="mt-4 mb-2">Product Images</Label>
      <Input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        multiple
        name="product_images"
        @change="(event: Event) => onImageChangeHandler(event)"
        required
      />

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variant</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead class="w-full">Weight (gr)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(variant, index) in variants" :key="index">
              <TableCell class="font-medium">
                <Input
                  class="w-fit"
                  type="text"
                  v-model="variant.value"
                  required
                />
              </TableCell>
              <TableCell
                ><Input
                  class="w-fit"
                  type="number"
                  v-model="variant.price"
                  required
              /></TableCell>
              <TableCell
                ><Input
                  class="w-40"
                  type="number"
                  v-model="variant.stocks"
                  required
                />
              </TableCell>
              <TableCell class="flex gap-3 items-center"
                ><Input
                  class="w-40"
                  type="number"
                  v-model="variant.weight"
                  required
                />

                <button
                  class="p-3"
                  type="button"
                  @click="() => deleteVariantHandler(variant.id)"
                >
                  <X />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div class="flex justify-end">
          <Button
            @click="addNewVariantHandler"
            type="button"
            class="my-4 block px-5"
            >+</Button
          >
        </div>

        <div class="">
          <Button type="submit" class="w-full mt-16">Submit</Button>
        </div>
      </div>
    </form>
  </section>
</template>
