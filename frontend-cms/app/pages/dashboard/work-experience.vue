<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto max-w-4xl space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/dashboard')" class="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:text-white">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
          <div>
            <p class="text-sm font-semibold text-zinc-200">Pengalaman Kerja</p>
            <p class="text-xs text-zinc-500">Kelola riwayat pengalaman kerja profesional</p>
          </div>
        </div>
        <button @click="openAddModal" class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Tambah Pengalaman
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="h-8 w-8 animate-spin text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>

      <!-- Empty -->
      <div v-else-if="!items.length" class="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-12 text-center">
        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
          <svg class="h-6 w-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </div>
        <p class="text-sm font-medium text-zinc-400">Belum ada pengalaman kerja</p>
        <p class="mt-1 text-xs text-zinc-600">Tambahkan pengalaman kerja pertama Anda untuk memulai portofolio</p>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <div
          v-for="item in sortedItems"
          :key="item.id"
          class="group rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700/60 hover:bg-zinc-900/60"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="text-sm font-semibold text-white">{{ item.position }}</p>
                <span v-if="item.is_current" class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Saat Ini</span>
              </div>
              <p class="mt-0.5 text-sm text-zinc-400">{{ item.company }}</p>
              <p class="mt-1 text-xs text-zinc-600">
                {{ formatDate(item.start_date) }}
                <span class="mx-1">—</span>
                {{ item.is_current ? 'Sekarang' : formatDate(item.end_date) }}
                <span v-if="item.location" class="ml-2 inline-flex items-center gap-1">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {{ item.location }}
                </span>
              </p>
              <p v-if="item.description" class="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-2">{{ item.description }}</p>
              <div v-if="item.highlights && item.highlights.length" class="mt-2 flex flex-wrap gap-1.5">
                <span
                  v-for="(h, hi) in item.highlights.slice(0, 3)"
                  :key="hi"
                  class="inline-flex items-center rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] text-zinc-400"
                >
                  {{ h.length > 40 ? h.slice(0, 40) + '…' : h }}
                </span>
                <span v-if="item.highlights.length > 3" class="text-[10px] text-zinc-600">+{{ item.highlights.length - 3 }} lagi</span>
              </div>
            </div>

            <div class="flex shrink-0 flex-col items-center gap-1">
              <div :class="sortedItems.indexOf(item) === 0 ? 'md:invisible' : ''">
                <button
                  v-if="sortedItems.indexOf(item) > 0"
                  @click="moveUp(item)"
                  class="rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-600 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                </button>
              </div>
              <div :class="sortedItems.indexOf(item) === sortedItems.length - 1 ? 'md:invisible' : ''">
                <button
                  v-if="sortedItems.indexOf(item) < sortedItems.length - 1"
                  @click="moveDown(item)"
                  class="rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-600 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
              </div>
              <button
                @click="openEditModal(item)"
                class="rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-500 transition-colors hover:border-violet-800/60 hover:text-violet-400"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button
                @click="confirmDelete(item)"
                class="rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-500 transition-colors hover:border-red-900/60 hover:text-red-400"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-10"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-800/60 bg-zinc-900 shadow-2xl">
        <div class="flex items-center justify-between border-b border-zinc-800/60 px-6 py-4">
          <h3 class="text-sm font-semibold text-zinc-200">{{ editingId ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja' }}</h3>
          <button @click="closeModal" class="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-5 px-6 py-6">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Perusahaan</label>
              <input
                v-model="form.company"
                type="text"
                placeholder="contoh: PT Teknologi Maju"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Posisi</label>
              <input
                v-model="form.position"
                type="text"
                placeholder="contoh: Frontend Engineer"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700"
              />
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Lokasi</label>
              <input
                v-model="form.location"
                type="text"
                placeholder="contoh: Jakarta, Indonesia"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Tanggal Mulai</label>
              <input
                v-model="form.start_date"
                type="date"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Tanggal Selesai</label>
              <input
                v-model="form.end_date"
                type="date"
                :disabled="form.is_current"
                class="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-violet-500/10"
                :class="form.is_current ? 'cursor-not-allowed border-zinc-800/40 bg-zinc-950/30 text-zinc-600' : 'border-zinc-800 bg-zinc-950/60 text-zinc-200 focus:border-violet-500/50'"
              />
            </div>
            <div class="flex items-end pb-2.5">
              <label class="flex cursor-pointer items-center gap-3">
                <button
                  type="button"
                  @click="form.is_current = !form.is_current"
                  :class="form.is_current ? 'bg-emerald-500' : 'bg-zinc-700'"
                  class="relative h-5 w-9 rounded-full transition-colors"
                >
                  <span
                    :class="form.is_current ? 'translate-x-4' : 'translate-x-0.5'"
                    class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                  ></span>
                </button>
                <span class="text-xs font-medium text-zinc-400">Saat ini masih bekerja</span>
              </label>
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Deskripsi</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Deskripsikan tanggung jawab dan pencapaian Anda..."
              class="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm leading-relaxed text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700"
            ></textarea>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Poin Penting</label>
            <textarea
              v-model="form.highlights"
              rows="4"
              placeholder="Tulis poin-poin penting (satu per baris)&#10;contoh:&#10;Mengembangkan sistem manajemen konten&#10;Meningkatkan performa website sebesar 40%&#10;Memimpin tim yang terdiri dari 5 orang"
              class="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm leading-relaxed text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-zinc-800/60 px-6 py-4">
          <button
            @click="closeModal"
            class="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Batal
          </button>
          <button
            @click="handleSave"
            :disabled="saving || !form.company || !form.position"
            class="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 disabled:opacity-50"
          >
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteConfirm = false"></div>
      <div class="relative z-10 w-full max-w-sm rounded-2xl border border-zinc-800/60 bg-zinc-900 p-6 shadow-2xl">
        <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
        </div>
        <h3 class="text-sm font-semibold text-zinc-200">Hapus Pengalaman Kerja</h3>
        <p class="mt-1 text-xs text-zinc-500">
          Apakah Anda yakin ingin menghapus pengalaman kerja sebagai
          <span class="font-medium text-zinc-300">{{ deletingItem?.position }}</span>
          di
          <span class="font-medium text-zinc-300">{{ deletingItem?.company }}</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Batal
          </button>
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="rounded-lg bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/30 disabled:opacity-50"
          >
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const api = useApi()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string
const token = useCookie('auth_token', { sameSite: 'lax' })

interface WorkExperience {
  id: number
  company: string
  position: string
  location: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  description: string | null
  highlights: string[] | null
  sort_order: number
}

const items = ref<WorkExperience[]>([])
const loading = ref(true)
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingId = ref<number | null>(null)
const deletingItem = ref<WorkExperience | null>(null)
const saving = ref(false)
const deleting = ref(false)

const form = reactive({
  company: '',
  position: '',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  highlights: '',
  sort_order: 0,
})

const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => a.sort_order - b.sort_order)
})

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
}

function resetForm() {
  form.company = ''
  form.position = ''
  form.location = ''
  form.start_date = ''
  form.end_date = ''
  form.is_current = false
  form.description = ''
  form.highlights = ''
  form.sort_order = 0
  editingId.value = null
}

function openAddModal() {
  resetForm()
  form.sort_order = items.value.length > 0
    ? Math.max(...items.value.map(i => i.sort_order)) + 1
    : 0
  showModal.value = true
}

function openEditModal(item: WorkExperience) {
  editingId.value = item.id
  form.company = item.company
  form.position = item.position
  form.location = item.location || ''
  form.start_date = item.start_date ? item.start_date.slice(0, 10) : ''
  form.end_date = item.end_date ? item.end_date.slice(0, 10) : ''
  form.is_current = item.is_current
  form.description = item.description || ''
  form.highlights = (item.highlights || []).join('\n')
  form.sort_order = item.sort_order
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function confirmDelete(item: WorkExperience) {
  deletingItem.value = item
  showDeleteConfirm.value = true
}

async function fetchItems() {
  loading.value = true
  try {
    const res = await api.get<{ success: boolean; data: WorkExperience[] }>('/work-experience')
    items.value = res.data
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.company || !form.position) return
  saving.value = true
  try {
    const payload = {
      company: form.company,
      position: form.position,
      location: form.location || undefined,
      start_date: form.start_date || undefined,
      end_date: form.is_current ? null : form.end_date || undefined,
      is_current: form.is_current,
      description: form.description || undefined,
      highlights: form.highlights
        ? form.highlights.split('\n').map(s => s.trim()).filter(Boolean)
        : undefined,
      sort_order: form.sort_order,
    }

    if (editingId.value) {
      const res = await api.put<{ success: boolean; data: WorkExperience }>(
        `/work-experience/${editingId.value}`,
        payload
      )
      const idx = items.value.findIndex(i => i.id === editingId.value)
      if (idx !== -1) items.value[idx] = res.data
    } else {
      const res = await api.post<{ success: boolean; data: WorkExperience }>(
        '/work-experience',
        payload
      )
      items.value.push(res.data)
    }

    closeModal()
  } catch {
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!deletingItem.value) return
  deleting.value = true
  try {
    await $fetch(`${apiBase}/work-experience/${deletingItem.value.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` },
    })
    items.value = items.value.filter(i => i.id !== deletingItem.value!.id)
    showDeleteConfirm.value = false
    deletingItem.value = null
  } catch {
  } finally {
    deleting.value = false
  }
}

async function moveUp(item: WorkExperience) {
  const idx = sortedItems.value.indexOf(item)
  if (idx <= 0) return
  const above = sortedItems.value[idx - 1]
  if (!above) return
  const temp = item.sort_order
  item.sort_order = above.sort_order
  above.sort_order = temp
  try {
    await Promise.all([
      api.put(`/work-experience/${item.id}`, { sort_order: item.sort_order }),
      api.put(`/work-experience/${above.id}`, { sort_order: above.sort_order }),
    ])
  } catch {
    item.sort_order = above.sort_order
    above.sort_order = temp
  }
}

async function moveDown(item: WorkExperience) {
  const idx = sortedItems.value.indexOf(item)
  if (idx >= sortedItems.value.length - 1) return
  const below = sortedItems.value[idx + 1]
  if (!below) return
  const temp = item.sort_order
  item.sort_order = below.sort_order
  below.sort_order = temp
  try {
    await Promise.all([
      api.put(`/work-experience/${item.id}`, { sort_order: item.sort_order }),
      api.put(`/work-experience/${below.id}`, { sort_order: below.sort_order }),
    ])
  } catch {
    item.sort_order = below.sort_order
    below.sort_order = temp
  }
}

onMounted(fetchItems)
</script>
