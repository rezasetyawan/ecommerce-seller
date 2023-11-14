import { SupabaseClient } from '@supabase/supabase-js';

interface ProductData {
    id: string,
    name: string
    created_at: string
    updated_at: string
    description: string
    category_id: string
    variants: { id: string, value: string, price: number, product_id: string, is_default: boolean, stocks: number, weight: string }[]
    sold: number
    images: { id: string, url: string, product_id: string }[]
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

const addProduct = async (client: SupabaseClient, data: ProductData) => {
    try {
        const slug = data.name.toLowerCase().replaceAll(" ", "-");

        const { error } = await client.from('products').insert({ id: data.id, name: data.name, created_at: data.created_at, updated_at: data.updated_at, description: data.description, category_id: data.category_id, sold: data.sold, slug: slug } as never)


        const { error: variant_error } = await client.from('variants').insert(data.variants as never[])
        const { error: image_error } = await client.from('product_images').insert(data.images as never[])

        if (error) {
            throw new Error(error.message)
        }

        if (variant_error) {
            throw new Error(variant_error.message)
        }

        if (image_error) {
            throw new Error(image_error.message)
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}

const deleteProduct = async (client: SupabaseClient, productId: string) => {
    try {
        const { error } = await client.from('products').delete().eq('id', productId)

        if (error) {
            throw new Error(error.message)
        }

    } catch (error: any) {
        throw new Error(error.message)
    }
}

const updateProductVariants = async (client: SupabaseClient, variants: Variant[]) => {
    try {
        const existedVariants = variants.filter(variant => variant.new === false)
        const unExistedVariants = variants.filter(variant => variant.new === true)

        await Promise.all(existedVariants.map(async (variant) => {
            const data = {
                value: variant.value,
                price: variant.price,
                stocks: variant.stocks,
                weight: variant.weight?.toString()
            }

            const { error } = await client.from('variants').update(data).eq('id', variant.id)
        }))

        await Promise.all(unExistedVariants.map(async (variant) => {
            const { error } = await client.from('variants').insert(variant)
        }))
    } catch (error: any) {
        throw new Error(error.message)
    }
}

interface UpdateProduct {
    name: string
    updated_at: string
    description: string
    category_id: string
}
const updateProduct = async (client: SupabaseClient, productId: string, updateData: UpdateProduct) => {
    try {
        const { error } = await client.from('products').update(updateData).eq('id', productId)

        if (error) {
            throw new Error(error.message)
        }

    } catch (error: any) {
        throw new Error(error.message)
    }
}

interface ProductImagesUrl {
    id: string
    url: string
    product_id: string
}

const deleteProductImageUrl = async (client: SupabaseClient, id: string) => {
    try {
        const { error } = await client.from('product_images').delete().eq('id', id)

        if (error) {
            throw new Error(error.message)
        }

    } catch (error: any) {
        throw new Error(error.message)
    }
}
const addProductImageUrl = async (client: SupabaseClient, data: ProductImagesUrl[]) => {
    try {
        const { error } = await client.from('product_images').insert(data)
        if (error) {
            throw new Error(error.message)
        }

    } catch (error: any) {
        throw new Error(error.message)
    }
}


export { addProduct, deleteProduct, updateProductVariants, updateProduct, deleteProductImageUrl, addProductImageUrl }