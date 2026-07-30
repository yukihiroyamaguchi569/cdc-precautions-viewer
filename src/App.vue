<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Fuse from 'fuse.js';
import rawData from '../data/appendix-a.json';
import type { Dataset, Precaution, PrecautionRecord } from './types';
import RecordCard from './components/RecordCard.vue';

const data = rawData as Dataset;
const records = data.records;

/* ---------- persisted UI state ---------- */
const lang = ref<'en' | 'ja'>((localStorage.getItem('lang') as 'en' | 'ja') || 'ja');
const dark = ref(document.documentElement.classList.contains('dark'));
watch(lang, (v) => localStorage.setItem('lang', v));
watch(dark, (v) => {
  document.documentElement.classList.toggle('dark', v);
  localStorage.setItem('theme', v ? 'dark' : 'light');
});

/* ---------- search ---------- */
const query = ref('');
const fuse = new Fuse(records, {
  includeScore: true,
  threshold: 0.34,
  ignoreLocation: true,
  keys: [
    { name: 'name', weight: 3 },
    { name: 'nameJa', weight: 3 },
    { name: 'aliases', weight: 3 },
    { name: 'sub', weight: 1.5 },
    { name: 'comments', weight: 0.6 },
    { name: 'commentsJa', weight: 0.6 },
    { name: 'seeAlso', weight: 0.8 },
  ],
});

/* ---------- filters ---------- */
type FilterKey = Precaution | 'Updated' | 'NoP2P';
const activeFilters = ref<Set<FilterKey>>(new Set());
const FILTERS: { key: FilterKey; label: string; labelJa: string }[] = [
  { key: 'Airborne', label: 'Airborne', labelJa: '空気' },
  { key: 'Droplet', label: 'Droplet', labelJa: '飛沫' },
  { key: 'Contact', label: 'Contact', labelJa: '接触' },
  { key: 'Standard', label: 'Standard only', labelJa: '標準のみ' },
  { key: 'Updated', label: 'Recently updated', labelJa: '更新あり' },
  { key: 'NoP2P', label: 'No person-to-person', labelJa: 'ヒト-ヒト感染なし' },
];
function toggleFilter(k: FilterKey) {
  const s = new Set(activeFilters.value);
  s.has(k) ? s.delete(k) : s.add(k);
  activeFilters.value = s;
}

function passesFilters(r: PrecautionRecord): boolean {
  for (const f of activeFilters.value) {
    if (f === 'Updated') {
      if (!r.updated) return false;
    } else if (f === 'NoP2P') {
      const c = `${r.comments ?? ''}${r.commentsJa ?? ''}`;
      if (!/Not transmitted|not transmitted|ヒト-ヒト感染しない/.test(c)) return false;
    } else if (f === 'Standard') {
      if (!(r.precautions.length === 1 && r.precautions[0] === 'Standard')) return false;
    } else if (!r.precautions.includes(f)) {
      return false;
    }
  }
  return true;
}

/* ---------- results ---------- */
const matched = computed<PrecautionRecord[]>(() => {
  const base = query.value.trim()
    ? fuse.search(query.value.trim()).map((r) => r.item)
    : records;
  return base.filter(passesFilters);
});

const isSearching = computed(() => query.value.trim().length > 0 || activeFilters.value.size > 0);

/* Grouped A–Z view when idle */
const grouped = computed(() => {
  const map = new Map<string, PrecautionRecord[]>();
  for (const r of matched.value) {
    const letter = r.name[0].toUpperCase();
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(r);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
});
const letters = computed(() => grouped.value.map((g) => g[0]));

/* ---------- deep link ---------- */
function scrollToHash() {
  const id = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ block: 'center' });
}
onMounted(() => setTimeout(scrollToHash, 60));

const searchInput = ref<HTMLInputElement | null>(null);
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput.value) {
      e.preventDefault();
      searchInput.value?.focus();
    }
    if (e.key === 'Escape') {
      query.value = '';
      searchInput.value?.blur();
    }
  });
});
</script>

<template>
  <div class="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <!-- Disclaimer -->
    <div
      class="bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
    >
      <span v-if="lang === 'ja'">
        ⚠ 本アプリは CDC 2007 Isolation Precautions Appendix A の<strong>非公式</strong>ビューアです。
        臨床判断は必ず各施設の感染対策マニュアルと
        <a class="underline" :href="data.meta.sourceUrl" target="_blank" rel="noopener">原典</a>
        に従ってください。
      </span>
      <span v-else>
        ⚠ Unofficial viewer of CDC 2007 Isolation Precautions Appendix A. Always defer to your
        facility's policy and the
        <a class="underline" :href="data.meta.sourceUrl" target="_blank" rel="noopener">official source</a>.
      </span>
    </div>

    <header
      class="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90"
    >
      <div class="mx-auto max-w-3xl px-4 pb-3 pt-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h1 class="text-lg font-extrabold tracking-tight sm:text-xl">
              CDC Precautions
              <span class="text-slate-400">·</span>
              <span class="text-slate-500 dark:text-slate-400">Appendix A</span>
            </h1>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="lang = lang === 'ja' ? 'en' : 'ja'"
            >
              {{ lang === 'ja' ? 'EN' : '日本語' }}
            </button>
            <button
              class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
              :title="dark ? 'Light mode' : 'Dark mode'"
              @click="dark = !dark"
            >
              {{ dark ? '☀' : '🌙' }}
            </button>
          </div>
        </div>

        <!-- Search box -->
        <div class="relative mt-3">
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            >🔍</span
          >
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            :placeholder="
              lang === 'ja'
                ? '疾患名・略語で検索（例: MRSA / ノロ / measles / けっかく）'
                : 'Search disease, alias… (MRSA / norovirus / TB)'
            "
            class="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-base shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <!-- Filter chips -->
        <div class="mt-2.5 flex flex-wrap gap-1.5">
          <button
            v-for="f in FILTERS"
            :key="f.key"
            class="rounded-full border px-2.5 py-1 text-xs font-medium transition"
            :class="
              activeFilters.has(f.key)
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
            "
            @click="toggleFilter(f.key)"
          >
            {{ lang === 'ja' ? f.labelJa : f.label }}
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-5">
      <p class="mb-3 text-xs text-slate-500 dark:text-slate-400">
        {{ matched.length }}{{ lang === 'ja' ? ' 件' : ' results' }}
        <span class="text-slate-300 dark:text-slate-600">·</span>
        {{ lang === 'ja' ? '全' : 'of' }} {{ records.length }}
      </p>

      <!-- Search / filtered flat list -->
      <div v-if="isSearching">
        <div v-if="matched.length" class="grid gap-3">
          <RecordCard v-for="r in matched" :key="r.id" :record="r" :lang="lang" />
        </div>
        <p v-else class="py-16 text-center text-slate-400">
          {{ lang === 'ja' ? '該当なし。別のキーワードをお試しください。' : 'No matches.' }}
        </p>
      </div>

      <!-- Idle: A–Z grouped -->
      <div v-else>
        <nav class="mb-4 flex flex-wrap gap-1">
          <a
            v-for="l in letters"
            :key="l"
            :href="`#letter-${l}`"
            class="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-slate-500 hover:bg-sky-100 hover:text-sky-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >{{ l }}</a
          >
        </nav>
        <section v-for="[letter, items] in grouped" :key="letter" class="mb-6">
          <h2
            :id="`letter-${letter}`"
            class="scroll-mt-40 mb-2 border-b border-slate-200 pb-1 text-sm font-extrabold text-sky-600 dark:border-slate-800 dark:text-sky-400"
          >
            {{ letter }}
          </h2>
          <div class="grid gap-3">
            <RecordCard v-for="r in items" :key="r.id" :record="r" :lang="lang" />
          </div>
        </section>
      </div>
    </main>

    <footer
      class="border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500"
    >
      <p>
        {{ lang === 'ja' ? '出典' : 'Source' }}:
        <a class="underline" :href="data.meta.sourceUrl" target="_blank" rel="noopener"
          >CDC Appendix A</a
        >
        · {{ lang === 'ja' ? 'Web版' : 'web version' }} {{ data.meta.webVersionDate }}
      </p>
      <p class="mt-1">
        {{ data.meta.license }}
      </p>
      <p class="mt-1">
        Code: MIT · Data: CDC (public domain). Press <kbd class="rounded bg-slate-200 px-1 dark:bg-slate-700">/</kbd> to search.
      </p>
    </footer>
  </div>
</template>
