<script setup lang="ts">
import { ArrowLeft, X } from "lucide-vue-next";
import { nanoid } from "nanoid";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { ProductDetail } from "~/types";
import { getTextAfterSomeText } from '~/utils';
import { addProductImage, deleteImages } from "~/utils/useImage";
import { addProductImageUrl, deleteProductImageUrl, updateProduct, updateProductVariants } from "~/utils/useProduct";
import { useSupabaseClient } from "../../../node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";

interface ProductApiResponse {
    data: ProductDetail;
}

interface Variant {
    id: string;
    value: string;
    price: number | undefined;
    stocks: number | undefined;
    is_default: boolean;
    product_id?: string;
    weight: number | undefined;
    new: boolean
}

const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const route = useRoute()
const slug = ref(route.params.slug as string)
const { $toast } = useNuxtApp();
const isLoading = ref(false)

const product = ref<ProductDetail>();
const { data } = await useFetch(`/api/products/${slug.value}`, {
    method: "get",
});
const productResponse = data.value as ProductApiResponse;
product.value = productResponse.data;

if (!productResponse.data) {
    useRouter().push('/404')
}

const categories = ref<{ id: string; name: string }[] | []>([]);
const { data: categorySnapshot } = await useFetch("/api/categories");

if (categorySnapshot.value) {
    categories.value = categorySnapshot.value.data;
}

const images = ref<File[]>([])
const variants = ref<Variant[]>([])

variants.value = product.value.variants.map(variant => {
    return {
        ...variant,
        weight: +variant.weight,
        new: false
    }
})

const addNewVariantFieldHandler = () => {
    variants.value = [
        ...variants.value,
        {
            id: nanoid(16),
            value: "",
            price: undefined,
            stocks: undefined,
            is_default: false,
            product_id: product.value?.id,
            weight: undefined,
            new: true
        },
    ];
};

const deleteVariantFieldHandler = (id: string) => {
    const index = variants.value?.findIndex((variant) => variant.id === id);

    if (index !== -1 && index !== undefined) {
        variants.value.splice(index, 1);
    }
};

// function to fetch image files from image url
const getImageFiles = async (): Promise<Blob[] | undefined> => {
    if (!product.value) return
    const files = await Promise.all(product.value.images.map(async (image) => {
        const { data } = await useFetch(image.url);
        return data.value as Blob;
    }))
    return files
};

// get image files and use it as inital value
const setImageInitialValue = async () => {
    if (!product.value?.images) return
    const blobs: Blob[] = await getImageFiles() as Blob[];
    const files = blobs.map((blob) => {
        const image = new File(
            [blob],
            `${nanoid(20)}`,
            {
                type: blob.type,
            }
        );
        return image
    })
    images.value = files
};

// get image url from existed image file
const getImageUrl = (image: File) => {
    if (image) {
        return URL.createObjectURL(image);
    }
};

// handle input images change
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

const isProductInfoChange = ref(false)
const isImageChanged = ref(false);
const isVariantsChanged = ref(false)

const updateProductData = async () => {
    try {
        isLoading.value = true
        if (!product.value) return

        // update product info if product info changed
        if (isProductInfoChange.value) {
            const updateData = {
                name: product.value.name,
                updated_at: Date.now().toString(),
                description: product.value.description,
                category_id: product.value.category_id,
                slug: product.value.name.toLowerCase().replaceAll(" ", "-")
            }

            await updateProduct(supabase, product.value.id, updateData)
        }

        // delete old images and upload new images, and then replace product image url if image changed
        if (isImageChanged.value) {
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

            const productImagesData = imagesUrl.map((url) => {
                return {
                    id: nanoid(16),
                    product_id: product.value?.id as string,
                    url: url,
                };
            });

            await addProductImageUrl(supabase, productImagesData)

            await Promise.all(product.value.images.map(async (image) => {
                await deleteProductImageUrl(supabase, image.id)
            }))

            const oldImageNames = product.value.images.map(image => {
                return getTextAfterSomeText(image.url, 'product-images/')
            })
            await deleteImages(supabase, oldImageNames)
        }

        // update product variant if variants changed
        if (isVariantsChanged.value) {
            await updateProductVariants(supabase, variants.value)
        }
    } catch (error: any) {
        throw new Error(error.message)
    } finally {
        isLoading.value = false
    }
}

const onSubmitHandler = async () => {
    return $toast.promise(updateProductData, {
        loading: "Loading...",
        success: (data) => {
            return `Product updated`;
        },
        error: (data: any) => (data.message ? `${data.message}` : "Failed to update product"),
    });
}

onMounted(async () => {
    if (product.value) {
        await setImageInitialValue()

        watch(product, () => {
            isProductInfoChange.value = true
        }, { deep: true })
    }

    if (images.value.length) {
        watch(images, () => {
            isImageChanged.value = true;
        }, { deep: true })
    }

    if (variants.value.length) {
        watch(variants, () => {
            isVariantsChanged.value = true
        }, { deep: true })
    }
    setInputInitialValue()
})




const setInputInitialValue = () => {
    let inputImages: HTMLInputElement | null;
    inputImages = document.getElementById("inputImages") as HTMLInputElement;

    if (images.value.length) {
        const data = new DataTransfer();

        images.value.forEach((image) => {
            data.items.add(image);
        });

        if (inputImages) {
            inputImages.files = data.files as FileList;
        }
    }
};

useHead({
    title: `$Edit {product.value.name} | Ini Toko`,
    titleTemplate: `Edit ${product.value.name} | Ini Toko`,
})

definePageMeta({
    layout: 'my-layout',
    middleware: 'seller'
})
</script>
<template>
    <Toaster position="top-center" richColors />
    <section class="mx-5 lg:mx-20 xl:mx-48 my-20" v-if="product">
        <NuxtLink :to="'/products'">
            <ArrowLeft />
        </NuxtLink>
        <h2 class="my-8 font-semibold text-xl text-center lg:text-2xl">Update Product</h2>
        <form @submit.prevent="onSubmitHandler">
            <Label class="text-sm lg:text-base">Product Name</Label>
            <Input type="text" required placeholder="Type here..." class="my-2" v-model="product.name" />

            <Label class="mt-6 mb-2 text-sm lg:text-base">Category</Label>
            <Select v-model="product.category_id" v-if="categories" required>
                <SelectTrigger class="w-fit">
                    <SelectValue placeholder="Select category" class="mr-2" />
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

            <template v-for="(image, index) in images" :key="index">
                <img v-if="image" :src="getImageUrl(image)" alt="Selected Image" class="max-w-[150px] mt-3 shadow-md" />
            </template>


            <Label for="product_images" class="mt-6 mb-2 text-sm lg:text-base">Product Images</Label>
            <Input class="md:w-min" type="file" ref="inputImages" id="inputImages" accept="image/png, image/jpeg, image/jpg"
                multiple name="product_images" @change="(event: Event) => onImageChangeHandler(event)" required />

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
                            <TableCell><Input class="w-fit text-sm" type="number" v-model="variant.price" required />
                            </TableCell>
                            <TableCell><Input class="text-sm w-28" type="number" v-model="variant.stocks" required />
                            </TableCell>
                            <TableCell class="flex gap-3 items-center justify-between">
                                <Input class="text-sm w-28" type="number" v-model="variant.weight" required />

                                <button class="p-3" type="button" @click="deleteVariantFieldHandler(variant.id)">
                                    <X class="w-4 h-4" />
                                </button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div class="flex justify-end">
                    <Button @click="addNewVariantFieldHandler" type="button" class="my-4 block px-5">+</Button>
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
