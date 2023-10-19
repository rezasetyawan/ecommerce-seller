import { serverSupabaseClient } from '#supabase/server'
// import { SupabaseClient } from '@supabase/supabase-js';

interface Product {
    id: number
    name: string
    price: number
    description: string
    category_id: number
    sold: number
    category: string
    stocks: number
    images: { id: string, url: string }[]
    variants: { id: string, value: string, price: number, stocks: number, is_default: boolean }[]
}


interface ProductSnapshots {
    data: Product | {}
    error?: boolean
    errorMessage?: string
}

export default eventHandler(async (event): Promise<ProductSnapshots> => {
    const client = await serverSupabaseClient(event);
    const productId = event.context.params?.id as string

    try {
        const { data, error } = await client.from('products').select('id, name, description, category_id, sold').eq('id', productId)

        if (error) {
            return { data: {}, error: true, errorMessage: error.message }
        }

        if (!data.length) {
            return { data: {} }
        }

        const productData = data[0] as { id: string, name: string, description: string, category_id: string }

        const { data: categories } = await client.from('categories').select('name').eq('id', productData.category_id)
        const { data: variants } = await client.from('variants').select('id, value, price, is_default, stocks').eq('product_id', productData.id)
        // const { data: stocks } = await client.from('variants').select('stocks').eq('product_id',productData.id)
        const { data: images } = await client.from('product_images').select('id, url').eq('product_id', productData.id)

        const productStocks = variants ? variants.map(data => +data.stocks) : []
        const defaultVariant = variants ? variants.find(variant => variant.is_default === true) : null;

        const product = {
            ...productData,
            price: defaultVariant ? +defaultVariant.price : NaN,
            category: categories ? categories[0].name : '',
            stocks: productStocks.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
            images: images,
            variants: variants
        }

        return { data: product }
    } catch (error: any) {
        return { data: {}, error: true, errorMessage: error.message }
    }
});
