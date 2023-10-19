import { serverSupabaseClient } from '#supabase/server'


interface Product {
    id: number,
    name: string
    created_at: number
    updated_at: string
    description: string
    category_id: number
}

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const productId = event.context.params?.id as string
    const body: Product = await readBody(event)


    try {
        const { data, error } = await client.from('products').update(body as never).eq('id', productId).select('name')

        if (error) {
            return { error: error.message }
        }

        return { message: `${data[0].name} updated` }
    } catch (error: any) {
        return { error: error.message }
    }
});
