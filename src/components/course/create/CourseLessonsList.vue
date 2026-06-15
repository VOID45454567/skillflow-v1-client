<!-- components/course/create/CourseLessonsList.vue -->
<template>
  <div
    class="glass-strong rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 animate-fadeInUp"
    style="animation-delay: 0.3s"
  >
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6"
    >
      <div class="flex items-center gap-2 md:gap-3">
        <div
          class="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-linear-to-br from-accent to-accent-pink flex items-center justify-center"
        >
          <Layers class="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div>
          <h2 class="text-lg md:text-xl font-bold text-gray-800">Уроки курса</h2>
          <p class="text-xs md:text-sm text-gray-500">
            {{ lessons.length }} уроков · {{ totalDuration }} мин
          </p>
        </div>
      </div>

      <BaseButton @click="emit('add')" size="sm" class="w-full sm:w-auto text-xs md:text-sm">
        <Plus class="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
        Добавить урок
      </BaseButton>
    </div>

    <!-- Lessons List -->
    <div v-if="lessons.length > 0" class="space-y-2 md:space-y-3">
      <LessonCardEditor
        v-for="(lesson, index) in lessons"
        :key="lesson.tempId || index"
        :lesson="lesson"
        :index="index"
        :is-selected="selectedLessonIndex === index"
        @select="emit('select', index)"
        @edit="emit('edit', index)"
        @remove="emit('remove', index)"
      />
    </div>

    <!-- Empty Lessons -->
    <div v-else class="text-center py-8 md:py-12">
      <Layers class="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-300 mb-2 md:mb-3" />
      <p class="text-sm md:text-base text-gray-500 mb-4">У вас пока нет уроков</p>
      <BaseButton @click="emit('add')" variant="tonal" size="sm" class="text-xs md:text-sm">
        <Plus class="w-3.5 h-3.5 md:w-4 md:w-4 mr-1" />
        Добавить первый урок
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Layers, Plus } from 'lucide-vue'
import BaseButton from '@/components/ui/AppButton.vue'
import LessonCardEditor from './LessonCardEditor.vue'
import type { Lesson, LessonContent } from '@/types/course/Lesson'

interface LessonWithTemp extends Partial<Omit<Lesson, 'content'>> {
  tempId?: number
  content: LessonContent
}

defineProps<{
  lessons: LessonWithTemp[]
  totalDuration: number
  selectedLessonIndex: number
}>()

const emit = defineEmits<{
  add: []
  edit: [index: number]
  remove: [index: number]
  select: [index: number]
}>()
</script>
