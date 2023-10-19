import { serverSupabaseClient } from '#supabase/server'


export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const query = getQuery(event)

    try {
        const { data, error } = await client.from('variantes').select('id, name, sold, category_id')

        if (error) {
            return { data: [] }
        }
    } catch (error: any) {

        return { data: error.message }
    }
});
