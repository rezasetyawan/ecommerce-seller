import { SupabaseClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { getTextAfterSomeText } from '~/utils'

const addProductImage = async (client: SupabaseClient, imageFile: File, supabaseUrl: string) => {
    try {
        // .${getTextAfterSomeText(imageFile.type, 'image/'
        const { data, error } = await client.storage.from("product-images").upload(`${nanoid(20)}`, imageFile, {
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

const deleteImages = async (client: SupabaseClient, imageNames: string[]) => {
    try {
        console.log(imageNames)
        const { error } = await client.storage.from('product-images').remove(imageNames)

        if (error) {
            throw new Error(error.message)
        }
        return
    } catch (error) {
        throw new Error(error as any)
    }
}

export { addProductImage, deleteImages }