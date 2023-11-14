import { serverSupabaseClient } from '#supabase/server'
export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const id = event.context.params?.categoryId as string

    try {
        const { error } = await client.from('categories').delete().eq('id', id)

        if (error) {
            return { error: true, errorMessage: error.message }
        }
        return { error: false, message: 'category deleted' }
    } catch (error: any) {
        return { error: true, errorMessage: error.mesage }
    }
});
