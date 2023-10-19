import { serverSupabaseClient } from '#supabase/server'
// import { SupabaseClient } from '@supabase/supabase-js';

interface Product {
    id: number
    name: string
    sold: number
    price?: number
    category_id: number
    category?: string
}

interface ProductSnapshots {
    data: Product[] | []
}

export default eventHandler(async (event): Promise<ProductSnapshots> => {
    const client = await serverSupabaseClient(event);

    try {
        const { data, error } = await client.from('products').select('id, name, sold, category_id')

        if (error || !data.length) {
            return { data: [] }
        }

        const productsData = data as Product[]

        const products = await Promise.all(productsData.map(async (data) => {
            const { data: categories } = await client.from('categories').select('name').eq('id', data.category_id)
            const { data: prices } = await client.from('variants').select('price').eq('product_id', data.id).eq('is_default', true)

            // if (categories?.length || prices?.length) {
            //     if (!categories?.length && prices?.length) {
            //         return {
            //             ...data,
            //             price: prices[0].price,
            //             category: ''
            //         }
            //     }

            //     if (categories?.length && !prices?.length) {
            //         return {
            //             ...data,
            //             price: NaN,
            //             category: categories[0].name
            //         }
            //     }

            //     if (categories?.length && prices?.length) {
            //         return {
            //             ...data,
            //             price: prices[0].price as number,
            //             category: categories[0].name
            //         }
            //     }
            // }

            return {
                ...data,
                price: prices ? prices[0].price : NaN,
                category: categories ? categories[0].name : ''
            }
        }))

        return { data: products }
    } catch (error: any) {
        return { data: [] }
    }
});
