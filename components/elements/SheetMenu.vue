<script setup lang="ts">
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

const props = defineProps<SheetMenuProps>();
</script>
<template>
  <Sheet :open="props.open">
    <!-- <SheetTrigger as-child>
      <Button variant="outline"> Open </Button>
    </SheetTrigger> -->
    <SheetContent side="left" class="w-full mt-14 sm:max-w-sm">
      <SheetHeader>
        <SheetTitle>Ini Toko</SheetTitle>
        <!-- <SheetDescription>
          Make changes to your profile here. Click save when you're done.
        </SheetDescription> -->
      </SheetHeader>
      <div class="grid gap-4 py-4">
        <!-- <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right"> Name </Label>
          <Input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right"> Username </Label>
          <Input id="username" value="@peduarte" class="col-span-3" />
        </div> -->
        <template v-for="route in props.routes" :key="route.href">
          <NuxtLink
            :to="route.href"
            class="text-sm font-medium transition-colors hover:text-primary"
            >{{ route.label }}</NuxtLink
          >
        </template>
      </div>
      <!-- <SheetFooter>
        <SheetClose as-child>
          <Button type="submit"> Save changes </Button>
        </SheetClose>
      </SheetFooter> -->
    </SheetContent>
  </Sheet>
</template>
