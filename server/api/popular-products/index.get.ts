import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);

    try {
        interface OrderProduct {
            variant_id: string,
            quantity: number
        }

        type Orders = { id: string, order_products: OrderProduct[] }[]

        const { data, error } = await client.from('orders').select('id, order_products(variant_id, quantity)').eq('status', 'FINISHED').returns<Orders>()


        if (error) {
            return { errorMessage: error.message }
        }

        const allOrderProducts = data.reduce((accumulator, order) => {
            return accumulator.concat(order.order_products);
        }, [] as OrderProduct[]);

        const summedQuantitiesArray = allOrderProducts.reduce((result, orderProduct) => {
            const { variant_id, quantity: sold } = orderProduct;
            const existingEntry = result.find(entry => entry.variant_id === variant_id);

            if (existingEntry) {
                existingEntry.sold += sold;
            } else {
                result.push({ variant_id, sold });
            }

            return result;
        }, [] as {variant_id: string, sold: number}[]).slice(0, 5) // only get first 5 element

        const productWithVariant = await Promise.all(summedQuantitiesArray.map(async (item) => {
            const { data } = await client.from('variants').select('value, product_id').eq('id', item.variant_id).single()

            if (!data) return null

            return {
                ...item,
                variant: data.value,
                product_id: data.product_id
            }
        }))

        const products = await Promise.all(productWithVariant.map(async (item) => {
            const { data: product } = await client.from('products').select('name, slug').eq('id', item?.product_id as unknown as string).single()
            const { data: image } = await client.from('product_images').select('url').eq('product_id', item?.product_id as unknown as string).single()

            return {
                ...item,
                ...product,
                image_url: image?.url
            }
        }))
        return { data: products }
    } catch (error: any) {
        return { errorMessage: error.message }
    }
});
