<script setup lang="ts">
import { toRefs } from "vue";
import { formatDate } from "../../../utils";
import StarRating from "../../elements/StarRating.vue";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Toggle } from "../../ui/toggle";
interface Review {
    id: string
    text: string
    created_at: string
    variant: string
    rating: string
    user_name: string
}

interface Props {
    review: Review
}

const props = defineProps<Props>()
const { review } = toRefs(props)

const emit = defineEmits<{ submitReply: [text: string] }>()

const showReplyForm = ref(false)

const reply = ref({
    text: ''
})
</script>
<template>
    <div class="border-b py-3 text-sm">
        <div class="flex justify-between items-center">
            <div class="flex flex-wrap gap-28 items-center">
                <StarRating :read-only="true" :rating-value="+review.rating" rating-size="1.5rem" />
                <p class="text-sm">{{ formatDate(review.created_at) }}</p>
            </div>
            <Toggle @click="showReplyForm = !showReplyForm">Reply</Toggle>
        </div>
        <div class="flex gap-3 items-center mt-1">
            <div class="w-8 h-8 overflow-hidden rounded-full lg:w-10 lg:h-10">
                <img :src="'https://ui-avatars.com/api/?name=' + review.user_name.replaceAll(' ', ' + ')">
            </div>
            <p class="font-medium">
                {{ review.user_name }}
            </p>
        </div>
        <div class="mt-2 text-sm">
            <p class="text-slate-500">Variant: {{ review.variant }}</p>
            <p>{{ review.text }}</p>
        </div>
        <div class="mt-4" v-show="showReplyForm">
            <form @submit.prevent="() => {
                emit('submitReply', reply.text)
                showReplyForm = false
            }">
                <Textarea v-model="reply.text" required />
                <div class="flex justify-end mt-2">
                    <Button size="sm" class="text-xs" type="submit">Submit</Button>
                </div>
            </form>
        </div>
    </div>
</template>