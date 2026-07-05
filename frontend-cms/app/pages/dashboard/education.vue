<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto max-w-4xl">
      <!-- Toast container -->
      <div class="fixed right-4 top-20 z-50 flex flex-col gap-2">
        <TransitionGroup name="toast">
          <div
            v-for="notif in notifications"
            :key="notif.id"
            :class="notif.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'"
            class="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-xl"
          >
            <svg v-if="notif.type === 'success'" class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <svg v-else class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ notif.message }}
          </div>
        </TransitionGroup>
      </div>

      <!-- Header -->
      <div class="mb-6 flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/dashboard')" class="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:text-white">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
          <div>
            <p class="text-sm font-semibold text-zinc-200">Pendidikan</p>
            <p class="text-xs text-zinc-500">Kelola riwayat pendidikan kamu</p>
          </div>
        </div>
        <button @click="openAddModal" class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Tambah Pendidikan
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center rounded-2xl border border-zinc-800/60 bg-zinc-900/40 py-20">
        <svg class="h-6 w-6 animate-spin text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>

      <!-- Empty state -->
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/60 bg-zinc-900/20 py-20">
        <svg class="mb-3 h-10 w-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        <p class="text-sm text-zinc-500">Belum ada data pendidikan</p>
        <p class="mt-1 text-xs text-zinc-600">Klik "Tambah Pendidikan" untuk memulai</p>
      </div>

      <!-- Education list -->
      <div v-else class="space-y-3">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="group rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700/60"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2.5">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-[11px] font-bold text-zinc-500">{{ index + 1 }}</span>
                <h3 class="truncate text-sm font-semibold text-white">{{ item.institution }}</h3>
              </div>
              <p class="mt-1.5 text-xs font-medium text-violet-400">
                {{ item.degree }}<template v-if="item.field_of_study"> — {{ item.field_of_study }}</template>
              </p>
              <p class="mt-1 text-xs text-zinc-500">
                {{ formatDate(item.start_date) }} — {{ item.end_date ? formatDate(item.end_date) : 'Sekarang' }}
              </p>
              <p v-if="item.description" class="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">{{ item.description }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-1">
              <button
                @click="moveUp(index)"
                :disabled="index === 0"
                title="Naik"
                class="rounded-lg border border-zinc-800 p-1.5 text-zinc-600 transition-colors hover:border-zinc-700 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
              </button>
              <button
                @click="moveDown(index)"
                :disabled="index === items.length - 1"
                title="Turun"
                class="rounded-lg border border-zinc-800 p-1.5 text-zinc-600 transition-colors hover:border-zinc-700 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div class="mx-1 h-6 w-px bg-zinc-800"></div>
              <button @click="openEditModal(item)" title="Edit" class="rounded-lg border border-zinc-800 p-1.5 text-zinc-600 transition-colors hover:border-violet-500/30 hover:text-violet-400">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button @click="confirmDelete(item)" title="Hapus" class="rounded-lg border border-zinc-800 p-1.5 text-zinc-600 transition-colors hover:border-red-500/30 hover:text-red-400">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add / Edit Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" @click.self="closeModal">
            <div class="w-full max-w-lg rounded-2xl border border-zinc-800/60 bg-zinc-900 shadow-2xl">
              <div class="flex items-center justify-between border-b border-zinc-800/60 px-6 py-4">
                <h2 class="text-sm font-semibold text-white">{{ editingId ? 'Edit' : 'Tambah' }} Pendidikan</h2>
                <button @click="closeModal" class="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <form @submit.prevent="handleSave" class="space-y-4 p-6">
                <div class="space-y-4">
                  <div>
                    <label class="mb-1.5 block text-xs font-medium text-zinc-400">Institusi <span class="text-red-400">*</span></label>
                    <input
                      v-model="form.institution"
                      type="text"
                      required
                      class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                      placeholder="Nama universitas/sekolah"
                    />
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label class="mb-1.5 block text-xs font-medium text-zinc-400">Gelar <span class="text-red-400">*</span></label>
                      <input
                        v-model="form.degree"
                        type="text"
                        required
                        class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                        placeholder="S1, D3, SMA..."
                      />
                    </div>
                    <div>
                      <label class="mb-1.5 block text-xs font-medium text-zinc-400">Bidang Studi</label>
                      <input
                        v-model="form.field_of_study"
                        type="text"
                        class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                        placeholder="Informatika, Ekonomi..."
                      />
                    </div>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label class="mb-1.5 block text-xs font-medium text-zinc-400">Tanggal Mulai <span class="text-red-400">*</span></label>
                      <input
                        v-model="form.start_date"
                        type="date"
                        required
                        class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                      />
                    </div>
                    <div>
                      <label class="mb-1.5 block text-xs font-medium text-zinc-400">Tanggal Selesai</label>
                      <input
                        v-model="form.end_date"
                        type="date"
                        class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                      />
                      <p class="mt-1 text-[10px] text-zinc-600">Kosongkan jika masih berlangsung</p>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-xs font-medium text-zinc-400">Deskripsi</label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      class="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm leading-relaxed text-zinc-200 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                      placeholder="GPA, prestasi, organisasi..."
                    ></textarea>
                  </div>
                </div>
                <div class="flex items-center justify-end gap-3 border-t border-zinc-800/60 pt-4">
                  <button type="button" @click="closeModal" class="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
                    Batal
                  </button>
                  <button type="submit" :disabled="saving" class="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 disabled:opacity-50">
                    {{ saving ? 'Menyimpan...' : 'Simpan' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Delete confirmation -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" @click.self="showDeleteModal = false">
            <div class="w-full max-w-sm rounded-2xl border border-zinc-800/60 bg-zinc-900 p-6 shadow-2xl">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              </div>
              <h2 class="text-sm font-semibold text-white">Hapus Pendidikan</h2>
              <p class="mt-1 text-xs leading-relaxed text-zinc-400">
                Yakin ingin menghapus riwayat pendidikan di
                <span class="font-medium text-zinc-200">{{ deleteTarget?.institution }}</span>?
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div class="mt-6 flex items-center justify-end gap-3">
                <button @click="showDeleteModal = false" class="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
                  Batal
                </button>
                <button @click="handleDelete" :disabled="saving" class="rounded-lg bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/30 disabled:opacity-50">
                  {{ saving ? 'Menghapus...' : 'Hapus' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const api = useApi()

interface EducationItem {
  id: number
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string | null
  description: string
  sort_order: number
}

interface Notification {
  id: number
  message: string
  type: 'success' | 'error'
}

const items = ref<EducationItem[]>([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingId = ref<number | null>(null)
const deleteTarget = ref<EducationItem | null>(null)
const notifications = ref<Notification[]>([])

const form = reactive({
  institution: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  description: '',
})

function showToast(message: string, type: 'success' | 'error' = 'success') {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3500)
}

function resetForm() {
  form.institution = ''
  form.degree = ''
  form.field_of_study = ''
  form.start_date = ''
  form.end_date = ''
  form.description = ''
}

function openAddModal() {
  editingId.value = null
  resetForm()
  showModal.value = true
}

function openEditModal(item: EducationItem) {
  editingId.value = item.id
  form.institution = item.institution
  form.degree = item.degree
  form.field_of_study = item.field_of_study ?? ''
  form.start_date = item.start_date ?? ''
  form.end_date = item.end_date ?? ''
  form.description = item.description ?? ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
}

async function fetchData() {
  loading.value = true
  try {
    const res = await api.get<{ success: boolean; data: EducationItem[] }>('/education')
    items.value = (res?.data ?? []).sort((a, b) => a.sort_order - b.sort_order)
  } catch {
    showToast('Gagal memuat data pendidikan', 'error')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  saving.value = true
  try {
    const payload = {
      institution: form.institution,
      degree: form.degree,
      field_of_study: form.field_of_study || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      description: form.description || null,
      sort_order: editingId.value
        ? (items.value.find(i => i.id === editingId.value)?.sort_order ?? items.value.length + 1)
        : items.value.length + 1,
    }
    if (editingId.value) {
      await api.put(`/education/${editingId.value}`, payload)
      showToast('Pendidikan berhasil diperbarui')
    } else {
      await api.post('/education', payload)
      showToast('Pendidikan berhasil ditambahkan')
    }
    closeModal()
    await fetchData()
  } catch {
    showToast('Gagal menyimpan data pendidikan', 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(item: EducationItem) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) return
  saving.value = true
  try {
    await api.del(`/education/${deleteTarget.value.id}`)
    showToast('Pendidikan berhasil dihapus')
    showDeleteModal.value = false
    deleteTarget.value = null
    await fetchData()
  } catch {
    showToast('Gagal menghapus pendidikan', 'error')
  } finally {
    saving.value = false
  }
}

async function moveUp(index: number) {
  if (index === 0) return
  const current = items.value[index]!
  const prev = items.value[index - 1]!
  try {
    await Promise.all([
      api.put(`/education/${current.id}`, { sort_order: prev.sort_order }),
      api.put(`/education/${prev.id}`, { sort_order: current.sort_order }),
    ])
    await fetchData()
  } catch {
    showToast('Gagal mengubah urutan', 'error')
  }
}

async function moveDown(index: number) {
  if (index === items.value.length - 1) return
  const current = items.value[index]!
  const next = items.value[index + 1]!
  try {
    await Promise.all([
      api.put(`/education/${current.id}`, { sort_order: next.sort_order }),
      api.put(`/education/${next.id}`, { sort_order: current.sort_order }),
    ])
    await fetchData()
  } catch {
    showToast('Gagal mengubah urutan', 'error')
  }
}

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
}

onMounted(fetchData)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}

.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
