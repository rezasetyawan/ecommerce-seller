import { useSupabaseClient } from "../node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { useSupabaseUser } from '../node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseUser'

export default defineNuxtRouteMiddleware(async (to, from) => {
    try {
        const user = useSupabaseUser()
        if (!user.value) {
            return navigateTo('/signin')
        }

        const userRole = await getUserRole('userrole')

        if (userRole !== 'seller') {
            return navigateTo('/403')
        }

        if (to.path === '/signin') {
            return
        }

        return
    } catch (error) {
        throw new Error(error as any);
    }
});

const getUserRole = async (claim: string) => {
    const supabase = useSupabaseClient()
    try {
        const { data, error } = await supabase.rpc('get_my_claim', { claim } as unknown as undefined);

        if (error) {
            throw new Error(error.message);
        }

        if (data) {
            return data as string
        }

    } catch (error) {
        throw new Error(error as any);
    }
}
