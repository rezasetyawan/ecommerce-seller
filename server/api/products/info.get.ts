import { serverSupabaseClient } from '#supabase/server'
// import { SupabaseClient } from '@supabase/supabase-js';

interface ProductInfo {
    id: number
    name: string
    sold: number
    price?: number
    category_id: number
    category?: string
    stocks?: number,
    slug: string
}

interface ProductSnapshots {
    data: ProductInfo[] | []
}

export default eventHandler(async (event): Promise<ProductSnapshots> => {
    const client = await serverSupabaseClient(event);

    try {
        const { data, error } = await client.from('products').select('id, name, sold, category_id, slug')

        if (error) {
            return { data: [] }
        }

        const productsData = data as ProductInfo[]

        const products = await Promise.all(productsData.map(async (data) => {
            const { data: categories } = await client.from('categories').select('name').eq('id', data.category_id).single()
            const { data: prices } = await client.from('variants').select('price').eq('product_id', data.id).eq('is_default', true).single()
            const { data: stocks } = await client.from('variants').select('stocks').eq('product_id', data.id)

            const productStocks = stocks?.map(data => data.stocks) || []
            return {
                ...data,
                price: prices ? prices.price : NaN,
                category: categories ? categories.name : '',
                stocks: productStocks.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
            }
        }))

        return { data: products }
    } catch (error: any) {

        return { data: error.message }
    }
});
