<script setup lang="ts">
import { VisAxis, VisStackedBar, VisXYContainer } from '@unovis/vue'

interface Props {
  data: { name: string, total: number }[]
}

const props = defineProps<Props>()
const { data } = toRefs(props)
type Data = { name: string, total: number }
</script>

<template>
  <VisXYContainer height="350px" :margin="{ left: 20, right: 20 }" :data="data">
    <VisStackedBar :x="(d: Data, i: number) => i" :y="(d: Data) => d.total" color="#18181B" :rounded-corners="4"
      :bar-padding="0.15" />
    <VisAxis type="x" :num-ticks="data.length" :tick-format="(index: number) => data[index]?.name" :grid-line="false"
      :tick-line="false" color="#18181B" />
    <VisAxis type="y" :num-ticks="data.length" :tick-format="(index: number) => data[index]?.name" :grid-line="false"
      :tick-line="false" :domain-line="false" color="#888888" />
  </VisXYContainer>
</template>