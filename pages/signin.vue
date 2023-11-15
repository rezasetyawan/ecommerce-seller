<script setup lang="ts">
import { useSupabaseClient } from "../node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Eye, EyeOff } from "lucide-vue-next";

const { $toast } = useNuxtApp()
const supabase = useSupabaseClient();
const router = useRouter();
const isLoading = ref(false)

const user = ref({
  email: "seller@gmail.com",
  password: "12345678",
});
const showPassword = ref(false);

const signInUser = async () => {
  try {
    isLoading.value = true
    const { data, error } = await supabase.auth.signInWithPassword(user.value);

    if (error) {
      throw new Error(error.message);
    }

    router.push("/");
  } catch (err: any) {
    throw new Error(err.message);
  } finally {
    isLoading.value = false
  }
};

const onSubmitHandler = async () => {
  return $toast.promise(signInUser, {
    loading: "Loading...",
    success: (data) => {
      return `Sign in success`;
    },
    error: (data: any) => (data.message ? `${data.message}` : "Failed to signin"),
  });
}

definePageMeta({
  layout: 'default'
})
</script>
<template>
  <Toaster position="top-center" richColors />
  <section class="flex font-rubik justify-center items-center h-screen">
    <form class="w-full md:max-w-sm" @submit.prevent="onSubmitHandler">
      <h1 class="font-semibold text-3xl my-10 text-center">SignIn</h1>
      <div class="relative">
        <Input type="email" class="w-full" placeholder="Email" required v-model="user.email" />
      </div>
      <div class="relative mt-5">
        <Input :type="showPassword ? 'text' : 'password'" class="w-full" placeholder="Password" required minlength="8"
          v-model="user.password" />
        <button type="button" @click="showPassword = !showPassword" class="absolute top-[30%] right-[2%] z-10">
          <Eye v-if="!showPassword" class="h-5 w-5 stroke-gray-400" />
          <EyeOff v-else class="h-5 w-5 stroke-gray-400" />
        </button>
      </div>
      <Button class="w-full mt-5" type="submit" :disabled="isLoading">Sign In</Button>
    </form>
  </section>
</template>
