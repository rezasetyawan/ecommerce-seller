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
    variants: { id: string, value: string, price: number, stocks: number, is_default: boolean, weight: string }[]
}


interface ProductSnapshots {
    data: Product | null
    error?: boolean
    errorMessage?: string
}

export default eventHandler(async (event): Promise<ProductSnapshots> => {
    const client = await serverSupabaseClient(event);
    const slug = event.context.params?.slug as string

    try {
        const { data, error } = await client.from('products').select('id, name, description, category_id, sold').eq('slug', slug)

        if (error) {
            return { data: null, error: true, errorMessage: error.message }
        }

        if (!data.length) {
            return { data: null, error: true, errorMessage: 'product not found' }
        }

        const productData = data[0] as { id: string, name: string, description: string, category_id: string }

        const { data: categories } = await client.from('categories').select('name').eq('id', productData.category_id)
        const { data: variants } = await client.from('variants').select('id, value, price, is_default, stocks, weight').eq('product_id', productData.id)
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
        return { data: null, error: true, errorMessage: error.message }
    }
});
