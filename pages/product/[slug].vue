<script setup lang="ts">
import { useElementVisibility } from "@vueuse/core";
import { Carousel, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { ProductDetail } from "~/types";
import { toRupiah, formatDate } from "~/utils"
import StarRating from "~/components/elements/StarRating.vue"
import { ArrowLeft } from "lucide-vue-next";

interface ProductApiResponse {
  data: ProductDetail;
}

interface Review {
  id: string
  text: string
  created_at: string
  variant: string
  rating: string
  user_name: string
}

interface ReviewApiResponse {
  data: Review[]
}

const slug = ref<string>();
slug.value = useRoute().params.slug as string;

const product = ref<ProductDetail>();

const { data } = await useFetch(`/api/products/${slug.value}`, {
  method: "get",
});
const apiResponse = data.value as ProductApiResponse;
product.value = apiResponse.data;

const { data: reviewsResponse } = await useFetch('/api/product-reviews/' + product.value?.id)
const reviews = ref<Review[]>([])
const reviewData = reviewsResponse.value as ReviewApiResponse
reviews.value = reviewData.data
reviews.value = [...reviews.value, {
  id: 'dfdfdfdf',
  text: 'gg bang',
  created_at: '1699709547403',
  variant: 'satu',
  rating: '4',
  user_name: 'asep'
},
{
  id: 'ghghghgh',
  text: 'awesome',
  created_at: '1699709557403',
  variant: 'dua',
  rating: '5',
  user_name: 'budi'
},
{
  id: 'ijklmnop',
  text: 'great job',
  created_at: '1699709567403',
  variant: 'tiga',
  rating: '3',
  user_name: 'charlie'
},
{
  id: 'qrstuvwx',
  text: 'nice work',
  created_at: '1699709577403',
  variant: 'empat',
  rating: '2',
  user_name: 'david'
},
{
  id: 'yzabcdef',
  text: 'fantastic',
  created_at: '1699709587403',
  variant: 'lima',
  rating: '1',
  user_name: 'eva'
},
{
  id: '12345678',
  text: 'gg bang',
  created_at: '1699709597403',
  variant: 'satu',
  rating: '4',
  user_name: 'asep'
},
{
  id: 'abcdefgh',
  text: 'awesome',
  created_at: '1699709607403',
  variant: 'dua',
  rating: '5',
  user_name: 'budi'
},
{
  id: 'ijklmnop',
  text: 'great job',
  created_at: '1699709617403',
  variant: 'tiga',
  rating: '3',
  user_name: 'charlie'
},
{
  id: 'qrstuvwx',
  text: 'nice work',
  created_at: '1699709627403',
  variant: 'empat',
  rating: '2',
  user_name: 'david'
},
{
  id: 'yzabcdef',
  text: 'fantastic',
  created_at: '1699709637403',
  variant: 'lima',
  rating: '1',
  user_name: 'eva'
}]

const seletedVariant = ref<string | undefined>("");
const price = ref(product.value.price);

seletedVariant.value = product.value.variants.find(
  (variant) => variant.is_default === true
)?.id;


watch(seletedVariant, () => {
  price.value = product.value?.variants.find(
    (s) => s.id === seletedVariant.value
  )?.price as number;
});

const productInfo = ref(null);
const isProductInfoInViewport = useElementVisibility(productInfo);
console.log(productInfo.value)
console.log(isProductInfoInViewport.value)


const totalRating = computed(() => {
  return reviews.value
    ? reviews.value.reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.rating)
    }, 0)
    : 0;
})

const getRatingPercentageAndCounts = (rating: string) => {
  if (!reviews.value.length) {
    return {
      percentage: 0,
      counts: 0
    };
  }

  const ratingCounts = reviews.value.filter(review => {
    return review.rating === rating;
  }).length

  const ratingPercentage = (ratingCounts / reviews.value.length) * 100;
  return {
    counts: ratingCounts.toFixed(0),
    percentage: ratingPercentage.toFixed(0),
  };
};

const RATINGS = ['1', '2', '3', '4', '5']
const showFullDesc = ref(false)

definePageMeta({
  layout: "my-layout",
});
</script>
<template>
  <div class="my-1 z-10 max-sm:mt-16 sm:absolute sm:top-6 lg:mx-8">
    <NuxtLink :to="'/products'">
      <ArrowLeft />
    </NuxtLink>
  </div>

  <section v-if="product" class="sm:flex gap-8 m-5 sm:mx-10 lg:m-10 lg:mx-20 font-rubik relative border-b sm:pt-6">
    <div class="sm:w-[40%] lg:w-[25%] h-full w-full bg-white">
      <Carousel :items-to-show="1">
        <Slide v-for="(image, key) in product?.images" :key="key" class="">
          <img :src="image.url" class="rounded-md object-cover aspect-[4/3" />
        </Slide>
        <template #addons>
          <Pagination />
        </template>
      </Carousel>

    </div>

    <!-- product info -->
    <div class="mt-2 sm:w-[50%]" ref="productInfo">
      <h2 class="text-lg font-semibold lg:text-2xl">{{ product?.name }}</h2>
      <div class="flex items-center gap-2 text-sm lg:text-base">
        <p>{{ product.sold }} <span class="font-medium">Sold</span></p>
        <span>•</span>
        <div class="flex gap-3 items-center">
          <StarRating :rating-value="1" :rating-count="1" class="mr-3" rating-size="1.6rem" />
          <p>{{ totalRating ? (totalRating / reviews.length).toFixed(1) : 0 }} ({{ reviews.length }} rating)</p>
        </div>
      </div>
      <div class="my-5">
        <p class="text-lg font-semibold lg:text-2xl">{{ toRupiah(price) }}</p>
      </div>

      <div>
        <p class="text-base font-medium lg:text-lg">Variants:</p>
        <div class="flex gap-2 flex-wrap my-2">
          <template v-for="variant in product.variants" :key="variant.id">
            <label
              class="font-medium px-[0.8em] py-[0.4em] min-w-[50px] text-xs text-center rounded-xl hover:cursor-pointer md:text-sm"
              :class="{ 'bg-slate-200': variant.id === seletedVariant }">
              <input type="radio" :value="variant.id" v-model="seletedVariant" class="hidden w-full h-full" />
              {{ variant.value }}
            </label>
          </template>
        </div>
      </div>
      <hr />
      <p class="my-3 text-sm" :class="{ 'line-clamp-6': !showFullDesc }">
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
      <button type="button" class="text-sm" @click="showFullDesc = !showFullDesc">{{ showFullDesc ? 'See less' : 'Seemore'
      }}</button>
    </div>
    <!-- end of product info -->
  </section>

  <!-- product reviews section -->
  <section>
    <div v-if="reviews" class="mx-5 lg:mx-20 md:flex gap-10">
      <!-- user rating -->
      <div class="w-full max-md:border-b max-md:pb-4 md:w-min">
        <h2 class="text-lg whitespace-nowrap font-medium lg:text-xl">Product Reviews</h2>
        <div class="flex items-center gap-5 mt-3">
          <StarRating :rating-value="1" :rating-count="1" class="mr-3" />
          <div class="flex items-end">
            <p class="text-2xl lg:text-6xl">
              {{ totalRating ? (totalRating / reviews.length).toFixed(1) : 0 }}
            </p>
            <p class="text-slate-500 text-sm lg:text-base">/5</p>
          </div>
        </div>
        <div class="text-sm mt-5">
          <template v-for="(rating, index) in RATINGS.reverse()" :key="index">
            <div class="w-full flex items-center gap-2">
              <div class="flex gap-5 items-center">
                <StarRating :rating-value="1" :rating-count="1" rating-size="1.4rem" />
                <p>{{ rating }}</p>
              </div>

              <div class="w-full bg-black/20 rounded-lg h-1.5">
                <div class="bg-black rounded-lg h-1.5"
                  :style="{ width: `${getRatingPercentageAndCounts(rating).percentage}%` }">
                </div>
              </div>
              <p>{{ getRatingPercentageAndCounts(rating).counts }}</p>
            </div>
          </template>
        </div>
      </div>

      <!-- user reviews -->
      <div class="w-full">
        <template v-for="review in  reviews" :key="review.id">
          <div class="border-b py-3 text-sm">
            <div class="flex flex-wrap gap-28 items-center">
              <StarRating :read-only="true" :rating-value="+review.rating" rating-size="1.5rem" />
              <p class="text-sm">{{ formatDate(review.created_at) }}</p>
            </div>
            <div class="flex gap-3 items-center mt-1">
              <div class="w-8 h-8 overflow-hidden rounded-full lg:w-10 lg:h-10">
                <img :src="'https://ui-avatars.com/api/?name=' + review.user_name.replaceAll(' ', ' + ')">
              </div>
              <p class="font-medium">
                {{ review.user_name }}
              </p>
            </div>
            <div class="mt-2 text-sm">
              <p class="text-slate-500">Variant: {{ review.variant }}</p>
              <p>{{ review.text }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
  <!-- end of product reviews section -->
</template>
