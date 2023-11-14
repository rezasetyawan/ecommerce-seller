import { serverSupabaseClient } from '#supabase/server'

interface CategoryName {
    data: { name: string } | {}
}
export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const id = event.context.params?.categoryId as string
    const body: CategoryName = await readBody(event)

    try {
        const { error } = await client.from('categories').update(body as never).eq('id', id)

        if (error) {
            return { error: true, errorMessage: error.message }
        }

        return { error: false, message: 'category updated' }
    } catch (error: any) {
        return { error: true, errorMessage: error.mesage }
    }
});
