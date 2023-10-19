<script setup lang="ts">
import { nanoid } from "nanoid";
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
import { Textarea } from "../../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { useSupabaseClient } from "../../node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";

interface Variant {
  id: string;
  value: string;
  price: number;
  stocks: number;
  is_default: boolean;
  product_id: string;
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

const client = useSupabaseClient();
const config = useRuntimeConfig();

const uploadImage = async (fileName: string, file: File) => {
  try {
    const { data, error } = await client.storage
      .from("product-images")
      .upload(`${fileName}`, file, {
        cacheControl: "60",
        upsert: true,
      });
    if (error) {
      throw new Error(error.message);
    }
    const url =
      config.public.SUPABASE_URL +
      "/storage/v1/object/public/product-images/" +
      data?.path;
    return url;
  } catch (error) {
    console.error(error);
  }
};

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
    price: 0,
    stocks: 0,
    is_default: true,
    product_id: product.value.id,
  },
]);

const addNewVariantHandler = () => {
  variants.value = [
    ...variants.value,
    {
      id: nanoid(16),
      value: "",
      price: 0,
      stocks: 0,
      is_default: false,
      product_id: product.value.id,
    },
  ];
};

const deleteVariantHandler = (id: string) => {
  const index = variants.value?.findIndex((variant) => variant.id === id);

  if (index !== -1 && index !== undefined) {
    variants.value.splice(index, 1);
  }
};

const images = ref<File[]>([]);
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

  console.log(images.value);
};

watch(
  product,
  () => {
    console.log(product.value);
  },
  { deep: true, immediate: true }
);

watch(
  variants,
  () => {
    console.log(variants.value);
  },
  { deep: true, immediate: true }
);

watch(images, () => console.log(images.value));

const getImageUrls = async () => {
  try {
    if (images.value) {
      for (let i = 0; i < images.value?.length; i++) {
        const file = images.value[i];
      }
    }
  } catch (error) {}
};

const onSubmitHandler = async () => {
  const imagesUrl = await Promise.all(
    images.value.map(async (image) => {
      const url = await uploadImage(image.name, image);
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

  const { data, error } = await useFetch("/api/products", {
    method: "POST",
    body: {
      ...product.value,
      images: productImages,
      variants: variants.value,
    },
  });

  console.log({
    variants: variants.value,
  });
};
</script>
<template>
  <section class="mx-80 my-20">
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
    <Select v-model="product.category_id" v-if="categories">
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
    <Textarea name="product_description" v-model="product.description" />

    <Label for="product_images" class="mt-4 mb-2">Product Images</Label>
    <Input
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      multiple
      name="product_images"
      @change="(event: Event) => onImageChangeHandler(event)"
    />

    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> Variant </TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(variant, index) in variants" :key="index">
            <TableCell class="font-medium">
              <Input class="w-fit" type="text" v-model="variant.value" />
            </TableCell>
            <TableCell
              ><Input class="w-fit" type="number" v-model="variant.price"
            /></TableCell>
            <TableCell class="flex gap-3 items-center"
              ><Input
                class="w-fit"
                type="number"
                v-model="variant.stocks"
              />

              <button
                class="p-3"
                @click="() => deleteVariantHandler(variant.id)"
              >
                x
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button @click="addNewVariantHandler" class="my-4 block">+</Button>

      <Button @click="onSubmitHandler" class="">Submit</Button>
    </div>
  </section>
</template>