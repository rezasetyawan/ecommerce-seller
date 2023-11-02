<script setup lang="ts">
import { useElementVisibility } from "@vueuse/core";
import { Carousel, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { ProductDetail } from "~/types";

interface ApiResponse {
  data: ProductDetail;
}

const slug = ref<string>();
slug.value = useRoute().params.slug as string;

const product = ref<ProductDetail>();

const { data } = await useFetch(`/api/products/${slug.value}`, {
  method: "get",
});

const apiResponse = data.value as ApiResponse;
product.value = apiResponse.data;

const seletedVariant = ref<string | undefined>("");
const price = ref(product.value.price);

seletedVariant.value = product.value.variants.find(
  (variant) => variant.is_default === true
)?.id;


const toRupiah = (price: number) => {
  return "Rp. " + price.toLocaleString("id-ID");
};

watch(seletedVariant, () => {
  price.value = product.value?.variants.find(
    (s) => s.id === seletedVariant.value
  )?.price as number;
});

const productInfo = ref<HTMLElement | null>(null);
const isProductInfoInViewport = useElementVisibility(productInfo);

definePageMeta({
  layout: "my-layout",
});
</script>
<template>
  <section
    v-if="product"
    class="sm:flex gap-8 m-5 lg:m-10 font-rubik mb-[1200px] relative pt-16"
  >
    <div
      class="sm:w-[40%] lg:w-[25%] h-full w-full bg-white"
      :class="{ 'lg:sticky lg:top-10 lg:left-10': isProductInfoInViewport }"
    >
      <Carousel :items-to-show="1">
        <Slide v-for="(image, key) in product?.images" :key="key" class="">
          <img :src="image.url" class="rounded-md object-cover aspect-[4/3" />
        </Slide>
        <template #addons>
          <!-- <Navigation /> -->
          <Pagination class="rounded" />
        </template>
      </Carousel>
    </div>

    <div class="sm:w-[50%]" ref="productInfo">
      <h2 class="text-2xl font-semibold">{{ product?.name }}</h2>
      <div>
        <p>{{ product.sold }} <span class="font-medium">Sold</span></p>
      </div>
      <div class="my-5">
        <p class="text-2xl font-semibold">{{ toRupiah(price) }}</p>
      </div>

      <div>
        <p class="text-lg font-medium">Variants:</p>
        <div class="flex gap-2 flex-wrap my-4">
          <template v-for="variant in product.variants" :key="variant.id">
            <label
              class="font-medium px-[0.8em] py-[0.4em] min-w-[50px] text-sm text-center rounded-xl hover:cursor-pointer"
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
      <p class="my-3 line-clamp-6">
        {{ product.description }} Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed id justo a mauris aliquet hendrerit. Nullam aliquet
        ex vel aliquet fermentum. Nam commodo hendrerit sapien, et consequat
        velit efficitur non. Integer tincidunt, justo ut euismod efficitur,
        nulla augue efficitur quam, non euismod lectus ex vitae mauris.
        Vestibulum non orci non dolor congue semper. Nulla facilisi. Sed auctor
        velit vel ligula tempus, vel cursus justo feugiat. Curabitur vestibulum
        nunc vel nisi posuere, et dignissim lectus tincidunt. In hac habitasse
        platea dictumst. Sed eu libero a nisi volutpat egestas non vel ipsum.
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas. In varius sapien eu libero venenatis, vitae
        cursus nisi venenatis. Nam vel libero a ligula fermentum consectetur.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
        cubilia Curae; Vivamus gravida, tortor id ultricies rhoncus, purus odio
        volutpat ipsum, nec fringilla mauris nunc eu dolor. Maecenas efficitur
        purus ut risus varius, non hendrerit libero condimentum. Sed non dolor
        non ligula iaculis ullamcorper. Phasellus vel nisl nec odio efficitur
        luctus. Morbi eu augue sed enim condimentum ultrices non a elit.
        Suspendisse nec nunc nec turpis aliquet facilisis in eget justo. Sed id
        ante non mi vulputate euismod. Etiam aliquet varius ligula, ut facilisis
        justo. Integer semper congue ligula, et finibus ante auctor nec. Integer
        volutpat, justo nec lacinia congue, lacus justo auctor quam, nec
        tincidunt velit quam vel mi. Aenean varius at dolor eu posuere. Vivamus
        ut ligula eu turpis hendrerit ultricies. Phasellus efficitur nunc vel
        metus auctor, id interdum lacus convallis. Maecenas rhoncus, quam nec
        tincidunt fermentum, urna velit semper mauris, vel egestas tellus mi
        vitae metus. Curabitur vitae condimentum metus, ut volutpat libero.
        Vivamus nec dui eu dui rhoncus hendrerit. Maecenas consectetur, metus in
        fringilla rhoncus, felis mi fermentum arcu, ut ultrices eros tortor nec
        metus. Duis id libero at velit commodo aliquam. Aenean nec turpis in
        turpis consequat interdum non et ante. Donec congue hendrerit tincidunt.
        Sed bibendum justo ut elit iaculis, eu ullamcorper libero efficitur. Sed
        non diam sit amet ipsum viverra varius eu vitae felis. Vivamus in
        hendrerit odio. Vivamus venenatis, odio in pharetra congue, sapien
        tortor luctus elit, ut imperdiet ligula mauris eu erat. Maecenas eget
        libero eu nisi cursus vehicula. Integer et metus volutpat, vehicula
        libero ac, laoreet dolor. Morbi in malesuada leo. Vestibulum in bibendum
        tortor, et viverra lorem. Nam semper, sem sit amet consequat hendrerit,
        dolor elit fermentum orci, vel imperdiet mauris sapien a massa. Sed
        fringilla nisi nec turpis sodales, vel pharetra elit condimentum.
        Integer venenatis nec massa at convallis. Curabitur tristique, turpis
        vel bibendum lacinia, urna nunc viverra mi, at fringilla orci mauris
        vitae arcu. Nam dignissim, elit at sodales laoreet, ligula sapien
        feugiat turpis, nec fermentum metus lectus nec urna. Quisque non mi eu
        tortor dictum euismod. Nulla facilisi. Sed nec nulla in elit tincidunt
        sodales. Sed consectetur eros vitae nulla bibendum, et egestas arcu
        efficitur. Sed ultrices, purus non ultrices auctor, augue metus cursus
        sapien, nec eleifend lectus purus id libero. Integer vitae massa vitae
        odio iaculis luctus non et mi. Praesent nec lacinia eros, sit amet
        tincidunt ligula. Fusce facilisis sagittis elit a vestibulum. Curabitur
        elementum, sapien vel lacinia hendrerit, odio quam dignissim massa, eu
        malesuada ex ligula et nulla. Sed nec fermentum orci. Sed dignissim
        bibendum nulla, eu aliquam justo luctus eu. Suspendisse ullamcorper
        libero non elit vehicula, ut fermentum massa consectetur. Sed facilisis
        dui at tristique pharetra. Vivamus quis sagittis tellus, in iaculis
        nulla. Donec eget lectus in velit ultrices fermentum. Vivamus at mi id
        dui imperdiet vulputate. Cras bibendum vehicula nibh, ac ultrices arcu
        fermentum sit amet. Sed eu condimentum odio. Vivamus in quam quis libero
        finibus malesuada. Nulla et ante nec odio hendrerit tristique ac non
        justo. Sed ullamcorper, felis sit amet luctus bibendum, velit nisi
        varius purus, eu sollicitudin mi sem id dui. Vivamus non lectus nec
        justo feugiat lacinia. Aenean malesuada efficitur metus, nec interdum
        turpis consectetur nec. Proin ac massa fermentum, laoreet orci vel,
        malesuada arcu. Integer feugiat nec dolor a vestibulum. Integer nec
        sagittis mi. Proin bibendum orci vel arcu elementum, a ultricies purus
        dapibus. Integer in orci ut ipsum facilisis tincidunt. Vivamus at
        convallis neque. Vestibulum varius id justo vel tincidunt. Integer
        interdum nec sem ac lacinia. Vivamus vel augue vitae elit iaculis
        tristique. Sed euismod bibendum bibendum. Ut consectetur justo in est
        hendrerit, eu vulputate nunc rhoncus. Nullam malesuada magna ut elit
        dictum, nec vehicula purus ultricies. Sed bibendum justo et libero
        tristique, vel condimentum felis tempor. In hac habitasse platea
        dictumst. Vivamus a felis non nulla pharetra dapibus et at quam.
        Phasellus eu finibus justo. Duis ut dui at nisl tincidunt viverra ut at
        lectus. Nunc ac fermentum libero. Cras pharetra purus a purus iaculis,
        vel sollicitudin dolor finibus. Vivamus gravida, ipsum ut fermentum
        cursus,
      </p>
    </div>
  </section>
</template>
