import { SupabaseClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const addProductImage = async (client: SupabaseClient, imageFile: File, supabaseUrl: string) => {
    try {
        const { data, error } = await client.storage.from("product-images").upload(nanoid(16), imageFile, {
            cacheControl: '60',
            upsert: true,
        })

        if (error) {
            throw new Error(error.message)
        }

        const url = supabaseUrl + '/storage/v1/object/public/product-images/' + data?.path
        return url
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export { addProductImage }