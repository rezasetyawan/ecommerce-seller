import { serverSupabaseClient } from '#supabase/server'

interface Product {
    id: string,
    name: string
    created_at: number
    updated_at: string
    description: string
    category_id: number
    variants: { id: string, value: string, price: number, product_id: string, is_default: boolean, stocks: number, weight: string }[]
    sold: number
    images: { id: string, url: string, product_id: string }[]
}

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const body: Product = await readBody(event)

    try {
        const slug = body.name.toLowerCase().replaceAll(" ", "-");

        const { error } = await client.from('products').insert({ id: body.id, name: body.name, created_at: body.created_at, updated_at: body.updated_at, description: body.description, category_id: body.category_id, sold: body.sold, slug: slug } as never)


        const { error: variant_error } = await client.from('variants').insert(body.variants as never[])
        const { error: image_error } = await client.from('product_images').insert(body.images as never[])

        if (error) {
            return { error: error.message }
        }

        if (variant_error) {
            return { error: variant_error.message }
        }

        if (image_error) {
            return { error: image_error.message }
        }


        return { message: 'product added' }
    } catch (error: any) {
        return { error: error.message }
    }
});
