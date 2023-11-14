import { serverSupabaseClient } from '#supabase/server'

interface Category {
    id: string;
    name: string
}
export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const body: Category = await readBody(event)

    try {
        const { error } = await client.from('categories').insert(body as never)

        if (error) {
            return { error: true, errorMessage: error.message }
        }

        return { error: false, message: 'category created' }
    } catch (error: any) {
        return { error: true, errorMessage: error.mesage }
    }
});
