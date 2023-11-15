<script setup lang="ts">
import { ArrowRightFromLine } from "lucide-vue-next";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "../ui/sheet";

interface SheetMenuProps {
  open: boolean;
  routes: {
    href: string;
    label: string;
    active: boolean;
  }[];
}

const supabase = useSupabaseClient()
const props = defineProps<SheetMenuProps>();
const emit = defineEmits(["route-click"])

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
  <Sheet :open="props.open">
    <SheetContent side="left" class="w-full mt-14 sm:max-w-sm">
      <SheetHeader>
        <SheetTitle>Ini Toko</SheetTitle>
      </SheetHeader>
      <div class="grid gap-4 py-4">
        <template v-for="route in props.routes" :key="route.href">
          <NuxtLink :to="route.href" class="text-sm text-black font-medium transition-colors hover:text-primary" @click="() => emit('route-click')">{{
            route.label }}
          </NuxtLink>
        </template>
      </div>
      <AlertDialog>
        <AlertDialogTrigger class="text-sm font-medium transition-colors hover:text-primary">
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
    </SheetContent>
  </Sheet>
</template>
