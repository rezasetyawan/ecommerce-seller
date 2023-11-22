import { serverSupabaseClient } from '#supabase/server'

interface CategorySnapshot {
    data: { id: string, name: string }[] | []
}

interface Query {
    search: string
}
export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const query: Query = getQuery(event)

    try {
        let queryBuilder = client.from('categories').select('id, name')

        if (query.search) {
            queryBuilder = queryBuilder.ilike('name', `%${query.search}%`)
        }

        const { data: categories, error } = await queryBuilder

        if (error) {
            return { data: [], error: true, errorMessage: error.message }
        }

        return { data: categories, error: false, errorMessage: '' } as CategorySnapshot
    } catch (error: any) {

        return { data: [], error: true, errorMessage: error.mesage }
    }
});
