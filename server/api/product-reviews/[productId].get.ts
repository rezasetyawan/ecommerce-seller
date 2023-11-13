import { serverSupabaseClient } from '#supabase/server'

interface Query {
    select: string[]
}
export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const productId = event.context.params?.productId as string
    const query: Query = getQuery(event)
    const select: string[] = Array.isArray(query.select) ? query.select : typeof query.select === 'string' ? [query.select] : [];

    try {
        if (select && select.length) {
            const selectedColumn = select.join(' ,')

            const { data, error } = await client.from('reviews').select(selectedColumn).eq('product_id', productId)

            if (error) {
                return { errorMessage: error.message }
            }

            return { data: data }
        }

        const { data, error } = await client.from('reviews').select('id, user_id, text, created_at, variant, rating').eq('product_id', productId)

        if (error) {
            return { errorMessage: error.message }
        }

        const reviews = await Promise.all(data.map(async (item) => {
            const { data } = await client.from('users').select('name').eq('id', item.user_id).single()

            return { ...item, user_name: data?.name }
        }))

        return { data: reviews }
    } catch (error: any) {

        return { errorMessage: error.message }
    }
});
