<script setup lang="ts">
import { ref } from "vue";
import { cn } from "@/lib/utils";
import { Menu, ArrowRightFromLine } from "lucide-vue-next";
import SheetMenu from "./SheetMenu.vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useSupabaseClient } from "../../node_modules/@nuxtjs/supabase/dist/runtime/composables/useSupabaseClient";

const supabase = useSupabaseClient()
const sheetOpen = ref(false);
const routes = [
  {
    href: `/`,
    label: "Overview",
    active: false,
  },
  {
    href: `/products`,
    label: "Products",
    active: false,
  },
  {
    href: `/order-list`,
    label: "Orders",
    active: false,
  },
  {
    href: `/categories`,
    label: "Categories",
    active: false,
  },
];

const signOutHandler = async () => {
  try {

    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
    useRouter().push('/signin')
  } catch (error) {

  }
}
</script>
<template>
  <header
    class="flex gap-2 items-center p-3 py-4 w-full font-rubik border-b z-[1000] h-14 lg:justify-between lg:px-8 fixed top-0 bg-white dark:bg-black">
    <Menu class="lg:hidden" @click="sheetOpen = !sheetOpen" />
    <h1 class="text-lg lg:text-2xl font-semibold">Ini Toko</h1>

    <nav class="gap-5 items-center hidden lg:flex">
      <template v-for="route in routes" :key="route.href">
        <NuxtLink :to="route.href" :class="cn('text-sm font-medium transition-colors hover:text-primary')
          ">{{ route.label }}</NuxtLink>
      </template>

      <AlertDialog>
        <AlertDialogTrigger class="text-sm font-medium">
          <ArrowRightFromLine />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure want to sign out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="signOutHandler">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  </header>
  <SheetMenu :open="sheetOpen" :routes="routes" @route-click="sheetOpen = false"/>
</template>
<style scoped>
html.dark {
  color-scheme: dark;
}
</style>
