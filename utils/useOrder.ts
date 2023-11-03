import { SupabaseClient } from '@supabase/supabase-js';

type OrderStatus = "PENDING" | "PAYMENT" | "ONPROCESS" | "SHIPPING" | "CANCELLED" | "FINISHED";

const updateOrderStatus = async (client: SupabaseClient, orderId: string, status: OrderStatus) => {
    try {
        const { data, error } = await client.from('orders').update({ status: status }).eq('id', orderId)

        if (error) {
            throw new Error(error.message)
        }

        return data
    } catch (error: any) {
        throw new Error(error.message)
    }
}

const updateOrderReceipt = async (client: SupabaseClient, orderId: string, receiptNumber: string) => {
    try {
        const { error: orderError } = await client.from('orders').update({ status: 'SHIPPING', }).eq('id', orderId)
        const { error: shipmentError } = await client.from('order_shipment').update({ receipt_number: receiptNumber }).eq('order_id', orderId)

        if (orderError) {
            throw new Error(orderError.message)
        }

        if (shipmentError) {
            throw new Error(shipmentError.message)
        }

        return
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export { updateOrderStatus, updateOrderReceipt }