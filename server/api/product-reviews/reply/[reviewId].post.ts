import { serverSupabaseClient } from '#supabase/server'

interface Reply {
    id: string
    user_id: string
    text: string
    review_id: string
    created_at: string
}

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const body: Reply= await readBody(event)

    try {
        const { error } = await client.from('review_replies').insert(body as never)

        if (error) {
            return { error: true, errorMessage: error.message }
        }

        return { error: false, message: 'reply created' }
    } catch (error: any) {
        return { error: true, errorMessage: error.mesage }
    }
});
