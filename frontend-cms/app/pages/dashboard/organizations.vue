<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto max-w-4xl space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/dashboard')" class="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:text-white">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <div>
            <p class="text-sm font-semibold text-zinc-200">Pengalaman Organisasi</p>
            <p class="text-xs text-zinc-500">Kelola pengalaman organisasi dan kegiatan sosial</p>
          </div>
        </div>
        <button @click="openAddModal" class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Tambah Organisasi
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="h-8 w-8 animate-spin text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>

      <!-- Empty -->
      <div v-else-if="!items.length" class="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-12 text-center">
        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
          <svg class="h-6 w-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <p class="text-sm font-medium text-zinc-400">Belum ada pengalaman organisasi</p>
        <p class="mt-1 text-xs text-zinc-600">Tambahkan pengalaman organisasi pertama Anda untuk memperkaya portofolio</p>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <div
          v-for="item in items"
          :key="item.id"
          class="group rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700/60 hover:bg-zinc-900/60"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="text-sm font-semibold text-white">{{ item.name }}</p>
                <span v-if="item.is_current" class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Saat Ini</span>
              </div>
              <p class="mt-0.5 text-sm text-zinc-400">{{ item.role }}</p>
              <p class="mt-1 text-xs text-zinc-600">
                {{ formatDate(item.start_date) }}
                <span class="mx-1">—</span>
                {{ item.is_current ? 'Sekarang' : formatDate(item.end_date) }}
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
          <h3 class="text-sm font-semibold text-zinc-200">{{ editingId ? 'Edit Pengalaman Organisasi' : 'Tambah Pengalaman Organisasi' }}</h3>
          <button @click="closeModal" class="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-5 px-6 py-6">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Nama Organisasi</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="contoh: Himpunan Mahasiswa Teknik Informatika"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Jabatan/Peran</label>
              <input
                v-model="form.role"
                type="text"
                placeholder="contoh: Ketua Bidang Kaderisasi"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700"
              />
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Tanggal Mulai</label>
              <input
                v-model="form.start_date"
                type="date"
                class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>
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
          </div>

          <div class="flex items-center pb-1">
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
              <span class="text-xs font-medium text-zinc-400">Masih Aktif</span>
            </label>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Deskripsi</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Deskripsikan peran dan kontribusi Anda di organisasi ini..."
              class="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm leading-relaxed text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700"
            ></textarea>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Pencapaian/Kegiatan</label>
            <textarea
              v-model="form.highlights"
              rows="4"
              placeholder="Tulis poin pencapaian atau kegiatan (satu per baris)&#10;contoh:&#10;Menyelenggarakan pelatihan coding untuk 100+ mahasiswa&#10;Memimpin tim panitia 15 orang&#10;Meningkatkan keanggotaan bidang sebesar 50%"
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
            :disabled="saving || !form.name || !form.role"
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
        <h3 class="text-sm font-semibold text-zinc-200">Hapus Pengalaman Organisasi</h3>
        <p class="mt-1 text-xs text-zinc-500">
          Apakah Anda yakin ingin menghapus pengalaman organisasi sebagai
          <span class="font-medium text-zinc-300">{{ deletingItem?.role }}</span>
          di
          <span class="font-medium text-zinc-300">{{ deletingItem?.name }}</span>?
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

interface Organization {
  id: number
  name: string
  role: string
  start_date: string | null
  end_date: string | null
  is_current: boolean
  description: string | null
  highlights: string[] | null
}

const items = ref<Organization[]>([])
const loading = ref(true)
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingId = ref<number | null>(null)
const deletingItem = ref<Organization | null>(null)
const saving = ref(false)
const deleting = ref(false)

const form = reactive({
  name: '',
  role: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  highlights: '',
})

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
}

function resetForm() {
  form.name = ''
  form.role = ''
  form.start_date = ''
  form.end_date = ''
  form.is_current = false
  form.description = ''
  form.highlights = ''
  editingId.value = null
}

function openAddModal() {
  resetForm()
  showModal.value = true
}

function openEditModal(item: Organization) {
  editingId.value = item.id
  form.name = item.name
  form.role = item.role
  form.start_date = item.start_date ? item.start_date.slice(0, 10) : ''
  form.end_date = item.end_date ? item.end_date.slice(0, 10) : ''
  form.is_current = item.is_current
  form.description = item.description || ''
  form.highlights = (item.highlights || []).join('\n')
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function confirmDelete(item: Organization) {
  deletingItem.value = item
  showDeleteConfirm.value = true
}

async function fetchItems() {
  loading.value = true
  try {
    const res = await api.get<{ success: boolean; data: Organization[] }>('/organizations')
    items.value = res.data
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.name || !form.role) return
  saving.value = true
  try {
    const payload = {
      name: form.name,
      role: form.role,
      start_date: form.start_date || undefined,
      end_date: form.is_current ? null : form.end_date || undefined,
      is_current: form.is_current,
      description: form.description || undefined,
      highlights: form.highlights
        ? form.highlights.split('\n').map(s => s.trim()).filter(Boolean)
        : undefined,
    }

    if (editingId.value) {
      const res = await api.put<{ success: boolean; data: Organization }>(
        `/organizations/${editingId.value}`,
        payload
      )
      const idx = items.value.findIndex(i => i.id === editingId.value)
      if (idx !== -1) items.value[idx] = res.data
    } else {
      const res = await api.post<{ success: boolean; data: Organization }>(
        '/organizations',
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
    await $fetch(`${apiBase}/organizations/${deletingItem.value.id}`, {
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

onMounted(fetchItems)
</script>
