<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto max-w-6xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/dashboard')" class="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:text-white">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <div>
            <p class="text-sm font-semibold text-zinc-200">CV Builder</p>
            <p class="text-xs text-zinc-500">Klik item untuk edit, drag untuk reorder</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button @click="syncSkills" :disabled="syncingSkills" class="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-50">
            <svg v-if="syncingSkills" class="h-3.5 w-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <svg v-else class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Sync Skills
          </button>
          <NuxtLink to="/dashboard/cv" class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Generate CV
          </NuxtLink>
        </div>
      </div>

      <!-- Sections (draggable between each other) -->
      <client-only>
        <draggable
          v-model="sections"
          item-key="key"
          handle=".section-drag-handle"
          :animation="200"
          ghost-class="section-ghost"
          class="space-y-4"
        >
          <template #item="{ element: section }">
            <div
              class="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 transition-all"
              :class="{ 'border-violet-500/50': persistingKey === section.key }"
            >
              <!-- Section header -->
              <div class="flex items-center justify-between border-b border-zinc-800/40 p-4">
                <div class="flex items-center gap-3">
                  <span class="section-drag-handle cursor-grab text-zinc-600 transition-colors hover:text-zinc-400 active:cursor-grabbing" title="Drag untuk reorder section">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/></svg>
                  </span>
                  <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400" v-html="sectionIcon(section.key)"></div>
                  <span class="text-sm font-semibold text-zinc-200">{{ section.label }}</span>
                  <span class="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">{{ section.count }}</span>
                  <svg v-if="persistingKey === section.key" class="h-3 w-3 animate-spin text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                </div>
                <button @click="openAdd(section)" class="flex items-center gap-1 rounded-lg border border-violet-900/40 bg-violet-950/20 px-3 py-1.5 text-xs font-medium text-violet-400 transition-colors hover:bg-violet-900/30">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Tambah
                </button>
              </div>

              <!-- Section content (collapsible) -->
              <div v-show="section.expanded" class="p-4">
                <div v-if="section.loading" class="flex justify-center py-8">
                  <svg class="h-5 w-5 animate-spin text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                </div>
                <div v-else-if="section.items.length === 0" class="py-6 text-center">
                  <p class="text-xs text-zinc-600 mb-3">{{ section.emptyText }}</p>
                  <button @click="openAdd(section)" class="inline-flex items-center gap-1 rounded-lg border border-violet-900/40 bg-violet-950/20 px-3 py-1.5 text-xs font-medium text-violet-400 transition-colors hover:bg-violet-900/30">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Tambah Data
                  </button>
                </div>

                <!-- Draggable items within section -->
                <draggable
                  v-else
                  :list="section.items"
                  item-key="id"
                  handle=".item-drag-handle"
                  :animation="200"
                  ghost-class="item-ghost"
                  class="space-y-2"
                  @end="persistOrder(section)"
                >
                  <template #item="{ element, index }">
                    <div
                      class="group flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800/40 bg-zinc-950/30 px-4 py-3 transition-all hover:border-zinc-700/60 hover:bg-zinc-900/50"
                      :class="{ 'border-violet-500/40 bg-violet-500/5': persistingKey === section.key }"
                      @click="openEdit(section, element)"
                    >
                      <!-- Drag handle -->
                      <span class="item-drag-handle flex cursor-grab items-center text-zinc-600 transition-colors hover:text-zinc-400 active:cursor-grabbing" @click.stop>
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/></svg>
                      </span>

                      <!-- Order badge -->
                      <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-500">{{ index + 1 }}</span>

                      <!-- Content -->
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium text-zinc-200">{{ getItemTitle(section.key, element) }}</p>
                        <p class="truncate text-xs text-zinc-500">{{ getItemSubtitle(section.key, element) }}</p>
                      </div>

                      <!-- Edit icon -->
                      <div class="shrink-0 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </template>
        </draggable>
      </client-only>

      <!-- Skills section (auto from GitHub) -->
      <div class="mt-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
        <div class="flex items-center justify-between border-b border-zinc-800/40 pb-4">
          <div class="flex items-center gap-3">
            <svg class="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            <span class="text-sm font-semibold text-zinc-200">Skill & Teknologi</span>
            <span class="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">{{ aggregatedSkills.length }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-zinc-600">Auto dari GitHub</span>
            <button v-if="aggregatedSkills.length > 0" @click="copySkillsToClipboard" class="rounded-lg border border-zinc-800 p-1.5 text-zinc-500 transition-colors hover:text-zinc-300" title="Copy semua skill">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </button>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <div v-if="skillsLoading" class="flex items-center gap-2 py-2">
            <svg class="h-4 w-4 animate-spin text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <span class="text-xs text-zinc-600">Memuat skills...</span>
          </div>
          <span
            v-for="skill in aggregatedSkills"
            :key="skill.name"
            class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-xs font-medium text-zinc-300"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="skillColor(skill.category)"></span>
            {{ skill.name }}
            <span class="text-[10px] text-zinc-600">x{{ skill.count }}</span>
          </span>
          <p v-if="aggregatedSkills.length === 0 && !skillsLoading" class="text-xs text-zinc-600 py-2">Klik "Sync Skills" untuk melihat skill dari repositori Anda</p>
        </div>
      </div>
    </div>

    <!-- Inline Edit Modal -->
    <SectionEditModal
      :show="modalShow"
      :section="modalSection"
      :item="modalItem"
      @close="modalShow = false"
      @saved="onModalSaved"
      @deleted="onModalDeleted"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

definePageMeta({ middleware: 'auth' })

const api = useApi()

interface AggregatedSkill {
  name: string
  count: number
  category: string
}

interface SectionConfig {
  key: string
  label: string
  icon: string
  editTo: string
  emptyText: string
  endpoint: string
}

interface Section extends SectionConfig {
  count: number
  expanded: boolean
  loading: boolean
  items: any[]
}

const aggregatedSkills = ref<AggregatedSkill[]>([])
const skillsLoading = ref(false)
const syncingSkills = ref(false)
const persistingKey = ref<string | null>(null)

const modalShow = ref(false)
const modalSection = ref<SectionConfig | null>(null)
const modalItem = ref<any | null>(null)

const sectionIcons: Record<string, string> = {
  education: '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
  'work-experience': '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
  certificates: '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>',
  organizations: '<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
}

function sectionIcon(key: string): string {
  return sectionIcons[key] || ''
}

const sectionConfigs: SectionConfig[] = [
  { key: 'education', label: 'Pendidikan', endpoint: '/education', editTo: '', icon: '', emptyText: 'Belum ada data pendidikan.' },
  { key: 'work-experience', label: 'Pengalaman Kerja', endpoint: '/work-experience', editTo: '', icon: '', emptyText: 'Belum ada pengalaman kerja.' },
  { key: 'certificates', label: 'Sertifikat', endpoint: '/certificates', editTo: '', icon: '', emptyText: 'Belum ada sertifikat.' },
  { key: 'organizations', label: 'Organisasi', endpoint: '/organizations', editTo: '', icon: '', emptyText: 'Belum ada data organisasi.' },
]

const sections = ref<Section[]>(sectionConfigs.map((cfg) => ({
  ...cfg,
  count: 0,
  expanded: true,
  loading: false,
  items: [],
})))

function openAdd(section: Section) {
  modalSection.value = section
  modalItem.value = null
  modalShow.value = true
}

function openEdit(section: Section, item: any) {
  modalSection.value = section
  modalItem.value = item
  modalShow.value = true
}

function onModalSaved(sectionKey: string) {
  const s = sections.value.find(s => s.key === sectionKey)
  if (s) loadSection(s)
}

function onModalDeleted(sectionKey: string) {
  const s = sections.value.find(s => s.key === sectionKey)
  if (s) loadSection(s)
}

function getItemTitle(sectionKey: string, item: any): string {
  const map: Record<string, (i: any) => string> = {
    education: (i) => i.institution || 'Tidak ada nama',
    'work-experience': (i) => `${i.position || ''}${i.company ? ` @ ${i.company}` : ''}`.trim() || 'Tidak ada nama',
    certificates: (i) => i.name || 'Tidak ada nama',
    organizations: (i) => `${i.role || ''}${i.name ? ` @ ${i.name}` : ''}`.trim() || 'Tidak ada nama',
  }
  return map[sectionKey]?.(item) || ''
}

function getItemSubtitle(sectionKey: string, item: any): string {
  const map: Record<string, (i: any) => string> = {
    education: (i) => [i.degree, i.field_of_study].filter(Boolean).join(' — ') || '',
    'work-experience': (i) => fmtDateRange(i.start_date, i.end_date, i.is_current),
    certificates: (i) => [i.issuer, fmtDateRange(i.issue_date, i.expiry_date, !i.expiry_date)].filter(Boolean).join(' — ') || '',
    organizations: (i) => fmtDateRange(i.start_date, i.end_date, i.is_current),
  }
  return map[sectionKey]?.(item) || ''
}

function fmtDateRange(start?: string, end?: string, isCurrent?: boolean): string {
  if (!start && !end) return ''
  const fmt = (d?: string) => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    } catch {
      return d
    }
  }
  return [fmt(start), isCurrent ? 'Sekarang' : fmt(end)].filter(Boolean).join(' — ')
}

function skillColor(category: string): string {
  const map: Record<string, string> = {
    language: 'bg-violet-400',
    framework: 'bg-emerald-400',
    database: 'bg-amber-400',
    tool: 'bg-blue-400',
  }
  return map[category] || 'bg-zinc-400'
}

async function loadSection(section: Section) {
  section.loading = true
  try {
    const res = await api.get<{ success: boolean; data: any[] }>(section.endpoint)
    section.items = res?.data || []
    section.count = section.items.length
  } catch {
    section.items = []
    section.count = 0
  } finally {
    section.loading = false
  }
}

async function persistOrder(section: Section) {
  persistingKey.value = section.key
  try {
    await Promise.all(
      section.items.map((item, idx) =>
        api.put(`${section.endpoint}/${item.id}`, { sort_order: idx + 1 })
      )
    )
  } catch {
  } finally {
    setTimeout(() => { persistingKey.value = null }, 500)
  }
}

async function fetchSkills() {
  skillsLoading.value = true
  try {
    const res = await api.get<{ success: boolean; data: AggregatedSkill[] }>('/github/skills')
    if (res?.data) {
      aggregatedSkills.value = res.data
    }
  } catch {
  } finally {
    skillsLoading.value = false
  }
}

async function syncSkills() {
  syncingSkills.value = true
  try {
    await api.post('/github/sync', {})
    await fetchSkills()
  } catch {
  } finally {
    syncingSkills.value = false
  }
}

function copySkillsToClipboard() {
  const text = aggregatedSkills.value.map(s => s.name).join(', ')
  navigator.clipboard?.writeText(text)
}

onMounted(async () => {
  await Promise.all(sections.value.map(s => loadSection(s)))
  fetchSkills()
})
</script>

<style scoped>
.section-ghost {
  opacity: 0.4;
  background: rgba(139, 92, 246, 0.05);
}
.item-ghost {
  opacity: 0.3;
  border-color: rgba(139, 92, 246, 0.4) !important;
  background: rgba(139, 92, 246, 0.05) !important;
}
</style>
