import { serverSupabaseClient } from '#supabase/server'
import { OrderDetail, OrderItem } from '~/types'

interface ApiResponse {
    data: OrderDetail
}

interface ErrorResponse {
    data: null;
    errorMessage: string
}

interface Query {
    user: string
}

export default eventHandler(async (event): Promise<ApiResponse | ErrorResponse> => {
    const client = await serverSupabaseClient(event);
    const orderId = event.context.params?.orderId as string

    try {
        let queryBuilder = client.from('orders').select('id, created_at, total, status').eq('id', orderId).single()
        const { data: order, error } = await queryBuilder

        let orderData: OrderDetail | null = null

        if (error) {
            return { data: null, errorMessage: error.message }
        }

        const { data: order_products } = await client.from('order_products').select('variant_id, quantity').eq('order_id', order.id)
        const { data: shipment } = await client.from('order_shipment').select('service, receipt_number, address_id, fee').eq('order_id', order.id).single()
        const { data: address } = await client.from('addresses').select('full_address, district, city, province, phone_number, name').eq('id', shipment?.address_id as unknown as string).single()



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
                    slug: product ? product.slug : ''
                } as OrderItem
            }))

            orderData = {
                id: order ? order.id : '',
                created_at: order ? order.created_at : '',
                total: order ? order.total : 0,
                status: order ? order.status : 'PENDING',
                order_items: products,
                address: {
                    name: address ? address.name : '',
                    phone_number: address ? address.phone_number : '',
                    full_address: address ? address.full_address : '',
                    district: address ? address.district : '',
                    city: address ? address.city : '',
                    province: address ? address.province : ''
                },
                shipment: {
                    receipt_number: shipment ? shipment.receipt_number : '',
                    shipment_fee: shipment ? shipment.fee : 0,
                    service: shipment ? shipment.service : '',
                },
                subtotal: order && shipment ? order.total - shipment.fee : 0,
            }
        }

        return {
            data: orderData as OrderDetail

        }

    } catch (error: any) {

        return { data: null, errorMessage: error.message }
    }
});
