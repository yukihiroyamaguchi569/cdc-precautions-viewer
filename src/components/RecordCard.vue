<script setup lang="ts">
import { computed } from 'vue';
import type { PrecautionRecord } from '../types';
import PrecautionBadge from './PrecautionBadge.vue';

const props = defineProps<{ record: PrecautionRecord; lang: 'en' | 'ja' }>();

const title = computed(() => {
  const base = props.lang === 'ja' && props.record.nameJa ? props.record.nameJa : props.record.name;
  return props.record.sub ? `${base}` : base;
});
const subtitle = computed(() =>
  props.lang === 'ja' && props.record.nameJa ? props.record.name : props.record.nameJa,
);
const duration = computed(() =>
  props.lang === 'ja' && props.record.durationJa ? props.record.durationJa : props.record.duration,
);
const comments = computed(() =>
  props.lang === 'ja' && props.record.commentsJa ? props.record.commentsJa : props.record.comments,
);
</script>

<template>
  <article
    :id="record.id"
    class="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60 sm:p-5"
  >
    <header class="flex flex-wrap items-start justify-between gap-2">
      <div class="min-w-0">
        <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">
          {{ title }}
          <span
            v-if="record.sub"
            class="ml-1 align-middle text-sm font-medium text-slate-500 dark:text-slate-400"
          >
            — {{ record.sub }}
          </span>
        </h3>
        <p v-if="subtitle" class="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
          {{ subtitle }}
        </p>
      </div>
      <span
        v-if="record.updated"
        class="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-400/20 dark:text-amber-200"
        :title="lang === 'ja' ? 'CDC による更新あり' : 'Updated by CDC'"
      >
        ⟳ {{ record.updated }}
      </span>
    </header>

    <!-- Precaution badges -->
    <div v-if="record.precautions.length" class="mt-3 flex flex-wrap gap-1.5">
      <PrecautionBadge
        v-for="p in record.precautions"
        :key="p"
        :type="p"
        :lang="lang"
      />
    </div>
    <div
      v-else
      class="mt-3 text-sm italic text-slate-400 dark:text-slate-500"
    >
      <template v-if="record.seeAlso">
        → {{ lang === 'ja' ? '参照' : 'See' }}: <span class="font-medium">{{ record.seeAlso }}</span>
      </template>
      <template v-else>{{ lang === 'ja' ? '該当項目参照' : 'n/a' }}</template>
    </div>

    <!-- Duration -->
    <dl v-if="duration && duration !== 'n/a'" class="mt-3 flex gap-2 text-sm">
      <dt class="shrink-0 font-semibold text-slate-500 dark:text-slate-400">
        {{ lang === 'ja' ? '期間' : 'Duration' }}
      </dt>
      <dd class="text-slate-700 dark:text-slate-200">{{ duration }}</dd>
    </dl>

    <!-- Comments -->
    <p
      v-if="comments"
      class="mt-2 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600 dark:bg-slate-900/40 dark:text-slate-300"
    >
      {{ comments }}
    </p>
  </article>
</template>
