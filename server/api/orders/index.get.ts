import { serverSupabaseClient } from '#supabase/server'
import { OrderItem, Order } from '~/types'
import { SupabaseClient } from '@supabase/supabase-js'
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

const getUserRole = async (client: SupabaseClient, claim: string) => {
    try {
        const { data, error } = await client.rpc('get_my_claim', { claim } as unknown as undefined);

        if (error) {
            throw new Error(error.message);
        }

        if (data) {
            return data as string
        }

    } catch (error) {
        throw new Error(error as any);
    }
}


export default eventHandler(async (event): Promise<ApiResponse | ErrorResponse> => {
    const client = await serverSupabaseClient(event);
    const query: Query = getQuery(event)

    try {
        if (query.user) {
            const { data, error } = await client.from('orders').select('id, created_at, total, status').eq('user_id', query.user).order('created_at', { ascending: false });

            if (error) {
                return { errorMessage: error.message }
            }

            const orders = await Promise.all(data.map(async (item) => {
                let unReviewedProductCounts = 0
                const { data: order_products } = await client.from('order_products').select('variant_id, quantity').eq('order_id', item.id)

                if (order_products) {
                    const products = await Promise.all(order_products.map(async (item) => {
                        const { data: variant } = await client.from('variants').select('product_id, price, value').eq('id', item.variant_id as unknown as string).single()

                        const { data: product } = await client.from('products').select('id, name, slug').eq('id', variant?.product_id as unknown as string).single()

                        const { data: image } = await client.from('product_images').select('url').eq('product_id', product?.id as unknown as string).single()

                        return {
                            id: product?.id ? product.id : '',
                            name: product ? product.name : '',
                            quantity: item.quantity,
                            price: variant ? variant.price : 0,
                            image_url: image ? image.url : '',
                            variant: variant ? variant.value : '',
                            slug: product ? product.slug : '',
                        } as OrderItem
                    }))

                    await Promise.all(products.map(async (product) => {
                        const { data } = await client.from('reviews').select('id').eq('order_id', item.id).eq('product_id', product.id).eq('user_id', query.user).single()

                        if (data) return
                        unReviewedProductCounts += 1
                    }))

                    return {
                        id: item ? item.id : '',
                        created_at: item ? item.created_at : '',
                        total: item ? item.total : 0,
                        status: item ? item.status : 'PENDING',
                        order_items: products,
                        unreviewed_product_counts: unReviewedProductCounts
                    }
                }
            }))

            return {
                data: {
                    orders: orders as Order[]
                }
            }
        }
        const { data, error } = await client.from('orders').select('id, created_at, total, status').order('created_at', { ascending: false });
        const { data: { user } } = await client.auth.getUser()

        if (!user) {
            return { errorMessage: 'please provide user query param' }
        }

        const userRole = await getUserRole(client, 'userrole')

        if (userRole !== 'seller') {
            return { errorMessage: 'Unauthorized' }
        }

        if (error) {
            return { errorMessage: error.message }
        }

        const orders = await Promise.all(data.map(async (item) => {
            let unReviewedProductCounts = 0
            const { data: order_products } = await client.from('order_products').select('variant_id, quantity').eq('order_id', item.id)

            if (order_products) {
                const products = await Promise.all(order_products.map(async (item) => {
                    const { data: variant } = await client.from('variants').select('product_id, price, value').eq('id', item.variant_id as unknown as string).single()

                    const { data: product } = await client.from('products').select('id, name, slug').eq('id', variant?.product_id as unknown as string).single()

                    const { data: image } = await client.from('product_images').select('url').eq('product_id', product?.id as unknown as string).single()

                    return {
                        id: product?.id ? product.id : '',
                        name: product ? product.name : '',
                        quantity: item.quantity,
                        price: variant ? variant.price : 0,
                        image_url: image ? image.url : '',
                        variant: variant ? variant.value : '',
                        slug: product ? product.slug : '',
                    } as OrderItem
                }))

                await Promise.all(products.map(async (product) => {
                    const { data } = await client.from('reviews').select('id').eq('order_id', item.id).eq('product_id', product.id).eq('user_id', query.user).single()

                    if (data) return
                    unReviewedProductCounts += 1
                }))

                return {
                    id: item ? item.id : '',
                    created_at: item ? item.created_at : '',
                    total: item ? item.total : 0,
                    status: item ? item.status : 'PENDING',
                    order_items: products,
                    unreviewed_product_counts: unReviewedProductCounts
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
