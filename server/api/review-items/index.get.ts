import { serverSupabaseClient } from '#supabase/server'

interface Query {
    user: string
    orderId: string
}

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const query: Query = getQuery(event)

    try {
        if (!query.user) {
            return { errorMessage: 'Unauthorized' }
        }

        const { data: reviews, error } = await client.from('reviews').select('product_id').eq('order_id', query.orderId).eq('user_id', query.user)

        if (error) {
            return { errorMessage: error.message }
        }

        if (!reviews.length) {
            let queryBuilder = client.from('orders').select('id, order_products(variant_id)').eq('status', 'FINISHED').eq("user_id", query.user)

            if (query.orderId) {
                queryBuilder.eq('id', query.orderId)
            }

            const { data, error } = await queryBuilder

            if (error) {
                return { errorMessage: error.message }
            }

            const variantIds = data?.map(d => {
                const orderProducts: { variant_id: string }[] = d.order_products as { variant_id: string }[]
                return orderProducts.map(p => p.variant_id)
            }).flat()

            const unReviewedVariants = await Promise.all(variantIds.map(async (variantId) => {
                const { data } = await client.from('variants').select('product_id, value').eq('id', variantId).single()
                return data
            }))

            const unReviewedProducts = await Promise.all(unReviewedVariants.map(async (variant) => {
                const { data: product } = await client.from('products').select('name, id').eq('id', variant?.product_id as unknown as string).single()
                const { data: image } = await client.from('product_images').select('url').eq('product_id', variant?.product_id as unknown as string).single()

                return {
                    id: product?.id,
                    product_name: product?.name,
                    variant: variant?.value,
                    image_url: image?.url
                }
            }))
            return { data: unReviewedProducts }
        }

        if (reviews.length) {
            const reviewedProductIds = reviews.map(review => review.product_id).join(",")

            let queryBuilder = client.from('orders').select('id, order_products(variant_id)').eq('status', 'FINISHED').eq("user_id", query.user)

            if (query.orderId) {
                queryBuilder.eq('id', query.orderId)
            }

            const { data, error } = await queryBuilder

            if (error) {
                return { errorMessage: error.message }
            }

            const variantIds = data?.map(d => {
                const orderProducts: { variant_id: string }[] = d.order_products as { variant_id: string }[]
                return orderProducts.map(p => p.variant_id)
            }).flat()

            const unReviewedVariants = await Promise.all(variantIds.map(async (variantId) => {
                const { data } = await client.from('variants').select('product_id, value').eq('id', variantId).single()
                return data
            }))

            const unReviewedProducts = await Promise.all(unReviewedVariants.map(async (variant) => {
                const { data: product } = await client.from('products').select('name, id').eq('id', variant?.product_id as unknown as string).not('id', 'in', `(${reviewedProductIds})`).single()

                if (!product) {
                    return null
                }

                const { data: image } = await client.from('product_images').select('url').eq('product_id', variant?.product_id as unknown as string).single()
                return {
                    id: product?.id,
                    product_name: product?.name,
                    variant: variant?.value,
                    image_url: image?.url
                }
            }))
            return { data: unReviewedProducts.filter(product => product !== null) }
        }

    } catch (error: any) {

        return { errorMessage: error.message }
    }
});
