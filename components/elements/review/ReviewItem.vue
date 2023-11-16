<script setup lang="ts">
import { toRefs } from "vue";
import { formatDate } from "../../../utils";
import StarRating from "../../elements/StarRating.vue";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Toggle } from "../../ui/toggle";
import { ChevronDown } from "lucide-vue-next";
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

interface Reply {
    id: string
    user_id: string
    text: string
    review_id: string
    created_at: string
}

interface ReplyApiResponse {
    data: Reply
}

const props = defineProps<Props>()
const { review } = toRefs(props)

const emit = defineEmits<{ submitReply: [text: string] }>()

const showReplyForm = ref(false)

const replyData = ref({
    text: ''
})

const showReply = ref(false)
const reply = ref<Reply>()

watch(showReply, async () => {
    if (showReply.value && !reply.value) {
        const { data } = await useFetch('/api/product-reviews/reply/' + review.value.id)
        const replyApiResponse = data.value as ReplyApiResponse
        reply.value = replyApiResponse.data
    }
})
</script>
<template>
    <div class="border-b py-3 text-sm">
        <div class="flex justify-between items-center">
            <div class="flex flex-wrap gap-28 items-center">
                <StarRating :read-only="true" :rating-value="+review.rating" rating-size="1.5rem" />
                <p class="text-sm">{{ formatDate(review.created_at) }}</p>
            </div>
            <div>
                <Toggle @click="showReplyForm = !showReplyForm">Reply</Toggle>
            </div>
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

        <div class="self-end flex justify-end mr-3 mt-2">
            <button @click="showReply = !showReply"
                class="flex gap-1 items-center text-xs lg:text-sm lg:gap-3 focus:outline-none">
                <span>{{ showReply ? 'Close reply' : 'Show reply' }}</span>
                <div class="transition-transform duration-500" :class="{ 'rotate-180': showReply }">
                    <ChevronDown class="w-4 lg:w-5" />
                </div>
            </button>
        </div>

        <div class="mt-4" v-show="showReplyForm">
            <form @submit.prevent="() => {
                emit('submitReply', replyData.text)
                showReplyForm = false
            }" v-if="!reply">
                <Textarea v-model="replyData.text" required />
                <div class="flex justify-end mt-2">
                    <Button size="sm" class="text-xs" type="submit">Submit</Button>
                </div>
            </form>
            <div v-else class="bg-slate-100 p-1.5 rounded-lg m-1 mt-4 lg:p-3 lg:m-2">Already replied</div>
        </div>

        <div v-show="showReply" class="bg-slate-100 p-1.5 rounded-lg m-1 mt-4 lg:p-3 lg:m-2">
            <div v-if="reply">
                <div class="flex gap-3 items-center mt-1">
                    <div class="w-8 h-8 overflow-hidden rounded-full lg:w-10 lg:h-10">
                        <img :src="'https://ui-avatars.com/api/?name=' + 'Ko Aliong'.replaceAll(' ', ' + ')">
                    </div>
                    <div class="flex justify-between gap-3  items-center">
                        <p class="font-medium text-xs lg:text-sm">
                            Ko Aliong
                        </p>
                        <p class="px-1.5 bg-green-200 text-green-500 font-medium rounded-md text-[0.7rem]">Seller</p>
                        <p class="text-xs lg:text-sm">{{ formatDate(reply.created_at) }}</p>
                    </div>

                </div>
                <div class="mt-2 text-sm">
                    <p>{{ reply.text }}</p>
                </div>
            </div>
            <div v-else>
                There's no reply yet
            </div>
        </div>
    </div>
</template>