import { serverSupabaseClient } from '#supabase/server'
// import { SupabaseClient } from '@supabase/supabase-js';

interface Product {
    id: number
    name: string
    sold: number
    price?: number
    category_id: number
    category?: string
    image_url?: string
    slug: string
}

interface ProductSnapshots {
    data: Product[] | []
}

export default eventHandler(async (event): Promise<ProductSnapshots> => {
    const client = await serverSupabaseClient(event);

    try {
        const { data, error } = await client.from('products').select('id, name, sold, category_id, slug').limit(5)

        if (error || !data.length) {
            return { data: [] }
        }

        const productsData = data as Product[]

        const products = await Promise.all(productsData.map(async (data) => {
            const { data: image } = await client.from('product_images').select('url').eq('product_id', data.id).single()
            const { data: categories } = await client.from('categories').select('name').eq('id', data.category_id)
            const { data: prices } = await client.from('variants').select('price').eq('product_id', data.id).eq('is_default', true)

            return {
                ...data,
                price: prices ? prices[0].price : NaN,
                category: categories ? categories[0].name : '',
                image_url: image ? image.url : '',
            }
        }))

        return { data: products }
    } catch (error: any) {
        return { data: [] }
    }
});
