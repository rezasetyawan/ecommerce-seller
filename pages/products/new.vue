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
import { ArrowLeft } from "lucide-vue-next";
import { addProduct } from "~/utils/useProduct"

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


const onImageChangeHandler = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let files: File[] = []
  if (target.files) {
    for (let i = 0; i < target.files.length; i++) {
      files.push(target.files[i]);
    }
  }
  images.value = files
};

const getImageUrl = (image: File) => {
  if (image) {
    return URL.createObjectURL(image);
  }
};

const onSubmitHandler = async () => {
  try {
    const transformedVariants = variants.value.map((variant) => {
      return {
        id: variant.id,
        value: variant.value,
        price: variant.price as number,
        stocks: variant.stocks as number,
        is_default: variant.is_default,
        product_id: variant.product_id,
        weight: variant.weight?.toString() as string
      };
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


    await addProduct(supabase, {
      ...product.value,
      images: productImages,
      variants: transformedVariants
    })

    // const { error } = await useFetch("/api/products", {
    //   method: "POST",
    //   body: {
    //     ...product.value,
    //     images: productImages,
    //     variants: transformedVariants,
    //   },
    // });

    // if (error) {
    //   throw new Error(error.value?.message);
    // }
  } catch (error: any) {
    console.error(error.message)
  }
};

definePageMeta({
  layout: "my-layout",
});
</script>
<template>
  <section class="mx-5 lg:mx-20 xl:mx-48 my-20">
    <NuxtLink :to="'/products'">
      <ArrowLeft />
    </NuxtLink>
    <h2 class="my-8 font-semibold text-xl text-center lg:text-2xl">Add New Product</h2>
    <form @submit.prevent="onSubmitHandler">
      <Label class="text-sm lg:text-base">Product Name</Label>
      <Input type="text" required placeholder="Type here..." class="my-2" v-model="product.name" />

      <Label class="mt-6 mb-2 text-sm lg:text-base">Category</Label>
      <Select v-model="product.category_id" v-if="categories" required>
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            <template v-for="category in categories" :key="category.id">
              <SelectItem :value="category.id">{{
                category.name
              }}</SelectItem>
            </template>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Label class="mt-6 mb-2 text-sm lg:text-base">Product Description</Label>
      <Textarea name="product_description" v-model="product.description" required />

      <template v-for="(image, index) in images" :key="image">
        <img v-if="image" :src="getImageUrl(image)" alt="Selected Image" class="max-w-[150px] mt-3" />
      </template>


      <Label for="product_images" class="mt-6 mb-2 text-sm lg:text-base">Product Images</Label>
      <Input class="md:w-min" type="file" accept="image/png, image/jpeg, image/jpg" multiple name="product_images"
        @change="(event: Event) => onImageChangeHandler(event)" required />

      <div class="mt-5">
        <Table class="overflow-x-scroll">
          <TableHeader>
            <TableRow class="text-sm">
              <TableHead>Variant</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stocks</TableHead>
              <TableHead class="">Weight (gr)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(variant, index) in variants" :key="index">
              <TableCell class="font-medium">
                <Input class="w-fit text-sm" type="text" v-model="variant.value" required />
              </TableCell>
              <TableCell><Input class="w-fit text-sm" type="number" v-model="variant.price" required /></TableCell>
              <TableCell><Input class="text-sm w-28" type="number" v-model="variant.stocks" required />
              </TableCell>
              <TableCell class="flex gap-3 items-center justify-between">
                <Input class="text-sm w-28" type="number" v-model="variant.weight" required />

                <button class="p-3" type="button" @click="() => deleteVariantHandler(variant.id)">
                  <X class="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div class="flex justify-end">
          <Button @click="addNewVariantHandler" type="button" class="my-4 block px-5">+</Button>
        </div>

        <div class="">
          <Button type="submit" class="w-full mt-16">Submit</Button>
        </div>
      </div>
    </form>
  </section>
</template>
<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
