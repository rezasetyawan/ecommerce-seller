import { SupabaseClient } from '@supabase/supabase-js';

export const getTotalRevenue = async (client: SupabaseClient) => {
    try {
        const { data: orders, error } = await client.from('orders').select('id, total').eq('status', 'FINISHED').returns<{ id: string, total: number }[]>()

        if (error) {
            throw new Error(error.message)
        }
        const arrayOfOrderRevenue = await Promise.all(orders.map(async (order) => {
            const { data } = await client.from('order_shipment').select('fee').eq('order_id', order.id).single()
            return order.total - data?.fee as number
        }))

        const totalRevenue = arrayOfOrderRevenue.reduce((sum, num) => sum + num, 0);
        return totalRevenue
    } catch (error: any) {
        throw new Error(error.message)
    }
}


export const getTotalRevenueEveryMonth = async (client: SupabaseClient) => {
    try {

        const monthlyRevenue: { [key: number]: number } = {};

        const { data: orders, error } = await client.from('orders').select('id, total, created_at').eq('status', 'FINISHED').returns<{ id: string, total: number, created_at: string }[]>()

        if (error) {
            throw new Error(error.message)
        }
        const arrayOfOrderRevenue = await Promise.all(orders.map(async (order) => {
            const { data } = await client.from('order_shipment').select('fee').eq('order_id', order.id).single()
            return {
                timestamp: +order.created_at,
                total: order.total - data?.fee as number
            }
        }))

        for (const order of arrayOfOrderRevenue) {
            const month = new Date(order.timestamp).getMonth(); // 0 for Jan, 1 for Feb, ...
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total;
        }

        const graphData = [
            { name: "Jan", total: 0 },
            { name: "Feb", total: 0 },
            { name: "Mar", total: 0 },
            { name: "Apr", total: 0 },
            { name: "May", total: 0 },
            { name: "Jun", total: 0 },
            { name: "Jul", total: 0 },
            { name: "Aug", total: 0 },
            { name: "Sep", total: 0 },
            { name: "Oct", total: 0 },
            { name: "Nov", total: 0 },
            { name: "Dec", total: 0 },
        ];


        for (const month in monthlyRevenue) {
            graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
        }

        return graphData


    } catch (error: any) {
        throw new Error(error.message)
    }
}