import { serverSupabaseClient } from '#supabase/server'

interface CategorySnapshot {
    data: { id: string, name: string }[] | []
}
export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);

    try {
        const { data: categories, error } = await client.from('categories').select('id, name')

        if (error) {
            return { data: [], error: true, errorMessage: error.message }
        }

        return { data: categories, error: false, errorMessage: '' } as CategorySnapshot
    } catch (error: any) {

        return { data: [], error: true, errorMessage: error.mesage }
    }
});
