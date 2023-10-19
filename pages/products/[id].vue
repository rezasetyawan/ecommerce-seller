<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { Badge } from "~/components/ui/badge";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { ProductDetail } from "~/types";
import { Toggle } from "~/components/ui/toggle";
const productId = ref<string>();
productId.value = useRoute().params.id as string;

const product = ref<ProductDetail>();

const { data, pending, error } = await useFetch(
  `/api/products/${productId.value}`,
  {
    method: "get",
  }
);
product.value = data.value?.data as ProductDetail;

const seletedVariant = ref<number>();
seletedVariant.value = product.value.variants.find(
  (variant) => variant.is_default === true
)?.id;

const price = ref(product.value.price);

const toRupiah = (price: number) => {
  return "Rp. " + price.toLocaleString("id-ID");
};

watch(seletedVariant, () => {
  price.value = product.value?.variants.find(
    (s) => s.id === seletedVariant.value
  )?.price as number;
});
</script>
<template>
  <section v-if="product" class="flex gap-8 m-10 font-rubik">
    <Carousel :items-to-show="1" class="max-w-[400px]">
      <Slide v-for="(image, key) in product?.images" :key="key">
        <img :src="image.url" class="rounded-md object-cover aspect-[4/3]" />
      </Slide>
      <template #addons>
        <Navigation />
        <Pagination class="rounded" />
      </template>
    </Carousel>

    <div class="w-full">
      <h2 class="text-2xl font-semibold">{{ product?.name }}</h2>
      <div>
        <p>{{ product.sold }} Sold</p>
      </div>
      <div class="my-5">
        <p class="text-2xl font-semibold">{{ price }}</p>
      </div>

      <div>
        <p>Variants</p>
        <div class="flex gap-2 flex-wrap my-2">
          <template v-for="variant in product.variants" :key="variant.id">
            <label
              class="font-medium px-[0.8em] py-[0.4em] min-w-[50px] text-sm text-center rounded-xl"
              :class="{ 'bg-slate-200': variant.id === seletedVariant }"
            >
              <input
                type="radio"
                :value="variant.id"
                v-model="seletedVariant"
                class="hidden w-full h-full"
              />
              {{ variant.value }}
            </label>
          </template>
        </div>
      </div>
      <hr />
      <p class="my-3">{{ product.description }}</p>
    </div>
  </section>
</template>
