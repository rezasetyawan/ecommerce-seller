import { serverSupabaseClient } from '#supabase/server'
// import { SupabaseClient } from '@supabase/supabase-js';

interface Product {
    name: string
    slug: string
}

interface ProductSnapshots {
    data: Product[] | []
}

interface Query {
    search: string
}

export default eventHandler(async (event): Promise<ProductSnapshots> => {
    const client = await serverSupabaseClient(event);

    const query: Query = getQuery(event)

    try {
        const { data, error } = await client.from('products').select('name, slug').ilike('name', `%${query.search}%`).order('sold', { ascending: false }).limit(5)

        if (error || !data.length) {
            return { data: [] }
        }

        return { data: data }
    } catch (error: any) {
        return { data: [] }
    }
});
