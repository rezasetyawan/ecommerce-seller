import { serverSupabaseClient } from '#supabase/server'
// import { SupabaseClient } from '@supabase/supabase-js';

interface Product {
    id: string
    name: string
    sold: number
    price?: number
    category_id: number
    category?: string
    image_url?: string
    slug: string
    rating?: string[] | []
}

interface ProductSnapshots {
    data: Product[] | []
}

interface Query {
    search: string
    category: string
}

export default eventHandler(async (event): Promise<ProductSnapshots> => {
    const client = await serverSupabaseClient(event);
    const query: Query = getQuery(event)

    try {
        let queryBuilder = client.from('products').select('id, name, sold, category_id, slug')
        
        if (query.category) {
            queryBuilder = queryBuilder.eq('category_id', query.category)
        }

        if (query.search) {
            queryBuilder = queryBuilder.ilike('name', `%${query.search}%`)
        }

        const { data, error } = await queryBuilder

        if (error || !data.length) {
            return { data: [] }
        }

        const productsData = data as Product[]

        const products = await Promise.all(productsData.map(async (data) => {
            const { data: image } = await client.from('product_images').select('url').eq('product_id', data.id).single()
            const { data: categories } = await client.from('categories').select('name').eq('id', data.category_id)
            const { data: prices } = await client.from('variants').select('price').eq('product_id', data.id).eq('is_default', true)
            const { data: rating } = await client.from('reviews').select('rating').eq('product_id', data.id)

            return {
                ...data,
                price: prices ? prices[0].price : NaN,
                category: categories ? categories[0].name : '',
                image_url: image ? image.url : '',
                rating: rating?.map(r => r.rating)
            }
        }))

        return { data: products }
    } catch (error: any) {
        return { data: [] }
    }
});
