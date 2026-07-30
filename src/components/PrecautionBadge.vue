<script setup lang="ts">
import { computed } from 'vue';
import { PRECAUTION_META, type Precaution } from '../types';

const props = defineProps<{ type: Precaution; lang: 'en' | 'ja' }>();
const meta = computed(() => PRECAUTION_META[props.type]);
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
    :class="meta.badge"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="meta.dot" />
    {{ lang === 'ja' ? meta.labelJa : meta.label }}
  </span>
</template>
