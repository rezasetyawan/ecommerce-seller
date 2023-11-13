<script setup lang="ts">
import { ref } from "vue";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-vue-next";
import SheetMenu from "./SheetMenu.vue";
// import { Toggle } from "../ui/toggle";
// import { useDark, useToggle } from "@vueuse/core";

// const isDark = useDark();

// const toggleDarkMode = useToggle(isDark);

const sheetOpen = ref<boolean>(false);
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
</script>
<template>
  <header
    class="flex gap-2 items-center p-3 font-rubik border-b z-[3000] lg:justify-between lg:px-8 fixed top-0 bg-white w-full dark:bg-black"
  >
    <Menu class="lg:hidden" @click="sheetOpen = !sheetOpen" />
    <h1 class="text-lg lg:text-2xl font-semibold">Ini Toko</h1>

    <nav class="gap-5 items-center hidden lg:flex">
      <template v-for="route in routes" :key="route.href">
        <NuxtLink
          :to="route.href"
          :class="
            cn('text-sm font-medium transition-colors hover:text-primary')
          "
          >{{ route.label }}</NuxtLink
        >
      </template>
      <!-- <Toggle @click="toggleDarkMode()">{{ isDark ? "Light" : "Dark" }}</Toggle> -->
    </nav>
  </header>
  <SheetMenu :open="sheetOpen" :routes="routes" />
</template>
<style scoped>
html.dark {
  color-scheme: dark;
}
</style>
