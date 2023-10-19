import { serverSupabaseClient } from '#supabase/server'
// import { SupabaseClient } from '@supabase/supabase-js';

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const productId = event.context.params?.id as string

    try {
        const { data, error } = await client.from('products').delete().eq('id', +productId).select('name')

        if (error) {
            return { message: error.message, status_code: error.code }
        }

        return { message: `${data[0].name} deleted` }

    } catch (error: any) {
        return { message: error.message }
    }
});
