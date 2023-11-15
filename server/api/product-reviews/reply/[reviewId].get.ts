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
    const reviewId = event.context.params?.reviewId as string

    try {
        const { data, error } = await client.from('review_replies').select('*').eq('review_id', reviewId).single()

        if (error) {
            return { error: true, errorMessage: error.message }
        }

        return { data: data as Reply}
    } catch (error: any) {
        return { error: true, errorMessage: error.mesage }
    }
});
