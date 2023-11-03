import { serverSupabaseClient } from '#supabase/server'
import { OrderItem, Order } from '~/types'



interface ApiResponse {
    data: {
        orders: Order[]
    }
}

interface ErrorResponse {
    errorMessage: string
}

interface Query {
    user: string
}

export default eventHandler(async (event): Promise<ApiResponse | ErrorResponse> => {
    const client = await serverSupabaseClient(event);
    const query: Query = getQuery(event)

    try {
        let queryBuilder = client.from('orders').select('id, created_at, total, status')

        if (query.user) {
            queryBuilder = queryBuilder.eq('user_id', query.user)
        }
        const { data, error } = await queryBuilder

        if (error) {
            return { errorMessage: error.message }
        }

        const orders = await Promise.all(data.map(async (item) => {
            const { data: order_products } = await client.from('order_products').select('variant_id, quantity').eq('order_id', item.id)

            if (order_products) {
                const products = await Promise.all(order_products.map(async (item) => {
                    const { data: variant } = await client.from('variants').select('product_id, price, value').eq('id', item.variant_id as unknown as string).single()

                    const { data: product } = await client.from('products').select('id, name').eq('id', variant?.product_id as unknown as string).single()

                    const { data: image } = await client.from('product_images').select('url').eq('product_id', product?.id as unknown as string).single()

                    return {
                        id: product?.id ? product.id : '',
                        name: product ? product.name : '',
                        quantity: item.quantity,
                        price: variant ? variant.price : 0,
                        image_url: image ? image.url : '',
                        variant: variant ? variant.value : ''
                    } as OrderItem
                }))

                return {
                    id: item ? item.id : '',
                    created_at: item ? item.created_at : '',
                    total: item ? item.total : 0,
                    status: item ? item.status : 'PENDING',
                    order_items: products,
                }
            }
        }))

        return {
            data: {
                orders: orders as Order[]
            }
        }
    } catch (error: any) {

        return { errorMessage: error.message }
    }
});
