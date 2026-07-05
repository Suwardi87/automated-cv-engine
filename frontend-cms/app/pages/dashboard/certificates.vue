<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto max-w-4xl space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
        <div>
          <p class="text-sm font-semibold text-zinc-200">Sertifikat</p>
          <p class="text-xs text-zinc-500">Kelola sertifikat dan pelatihan yang pernah diambil</p>
        </div>
        <button @click="openAddModal" class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Tambah Sertifikat
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <svg class="h-8 w-8 animate-spin text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>

      <!-- Empty state -->
      <div v-else-if="certificates.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 py-20">
        <svg class="mb-4 h-12 w-12 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
        <p class="text-sm font-medium text-zinc-500">Belum ada sertifikat</p>
        <p class="mt-1 text-xs text-zinc-600">Tambahkan sertifikat pertamamu untuk ditampilkan di portofolio</p>
      </div>

      <!-- Certificate list -->
      <div v-else class="space-y-3">
        <div
          v-for="cert in sortedCertificates"
          :key="cert.id"
          class="group rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all hover:border-zinc-700"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h3 class="truncate text-base font-semibold text-white">{{ cert.name }}</h3>
                <span class="shrink-0 rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-500">Urutan {{ cert.sort_order }}</span>
              </div>
              <p class="mt-1 text-sm text-zinc-400">{{ cert.issuer }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                <span>{{ formatDate(cert.issue_date) }}</span>
                <span v-if="cert.expiry_date">— {{ formatDate(cert.expiry_date) }}</span>
                <a v-if="cert.credential_url" :href="cert.credential_url" target="_blank" rel="noopener" class="flex items-center gap-1 text-violet-400 hover:text-violet-300">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  Lihat Kredensial
                </a>
              </div>
              <p v-if="cert.description" class="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-2">{{ cert.description }}</p>
            </div>
            <div class="flex shrink-0 gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button @click="openEditModal(cert)" class="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-500 transition-colors hover:border-violet-500/30 hover:text-violet-400" title="Edit">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button @click="confirmDelete(cert)" class="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-500 transition-colors hover:border-red-500/30 hover:text-red-400" title="Hapus">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="closeModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-lg rounded-2xl border border-zinc-800/60 bg-zinc-950 p-6 shadow-2xl">
          <h3 class="mb-1 text-lg font-bold text-white">{{ editingId ? 'Edit Sertifikat' : 'Tambah Sertifikat' }}</h3>
          <p class="mb-6 text-xs text-zinc-500">Lengkapi data sertifikat di bawah ini</p>

          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Nama Sertifikat <span class="text-red-400">*</span></label>
              <input v-model="form.name" type="text" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" placeholder="Contoh: AWS Solutions Architect" />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Penerbit <span class="text-red-400">*</span></label>
              <input v-model="form.issuer" type="text" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" placeholder="Contoh: Amazon Web Services" />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Deskripsi</label>
              <textarea v-model="form.description" rows="3" class="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm leading-relaxed text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" placeholder="Deskripsi singkat tentang sertifikat"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-medium text-zinc-400">Tanggal Terbit <span class="text-red-400">*</span></label>
                <input v-model="form.issue_date" type="date" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-medium text-zinc-400">Tanggal Kadaluarsa</label>
                <input v-model="form.expiry_date" type="date" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">URL Kredensial</label>
              <input v-model="form.credential_url" type="url" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" placeholder="https://credential.example.com/verify/..." />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-zinc-400">Urutan Tampil</label>
              <input v-model.number="form.sort_order" type="number" min="0" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" />
              <p class="mt-1 text-[10px] text-zinc-600">Semakin kecil angka, semakin atas posisinya</p>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between gap-3">
            <p v-if="formError" class="text-xs text-red-400">{{ formError }}</p>
            <p v-else class="text-xs text-zinc-600"></p>
            <div class="flex gap-2">
              <button @click="closeModal" class="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white">
                Batal
              </button>
              <button @click="handleSubmit" :disabled="saving" class="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 disabled:opacity-50">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete confirmation -->
    <Transition name="fade">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="showDeleteConfirm = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-sm rounded-2xl border border-zinc-800/60 bg-zinc-950 p-6 shadow-2xl">
          <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-white">Hapus Sertifikat</h3>
          <p class="mt-1 text-sm text-zinc-400">Apakah kamu yakin ingin menghapus <span class="font-semibold text-zinc-200">{{ deletingCert?.name }}</span>? Tindakan ini tidak bisa dibatalkan.</p>
          <div class="mt-6 flex justify-end gap-2">
            <button @click="showDeleteConfirm = false" class="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white">
              Batal
            </button>
            <button @click="handleDelete" :disabled="saving" class="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50">
              {{ saving ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface Certificate {
  id: number
  name: string
  issuer: string
  description: string | null
  credential_url: string | null
  issue_date: string
  expiry_date: string | null
  sort_order: number
}

const api = useApi()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const certificates = ref<Certificate[]>([])
const loading = ref(true)
const saving = ref(false)

const showModal = ref(false)
const editingId = ref<number | null>(null)
const formError = ref('')

const showDeleteConfirm = ref(false)
const deletingCert = ref<Certificate | null>(null)

const form = reactive({
  name: '',
  issuer: '',
  description: '',
  credential_url: '',
  issue_date: '',
  expiry_date: '',
  sort_order: 0,
})

const sortedCertificates = computed(() => {
  return [...certificates.value].sort((a, b) => a.sort_order - b.sort_order)
})

onMounted(async () => {
  await fetchCertificates()
})

async function fetchCertificates() {
  loading.value = true
  try {
    const res = await api.get<{ data: Certificate[] }>('/certificates')
    certificates.value = res.data || []
  } catch {
    certificates.value = []
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.name = ''
  form.issuer = ''
  form.description = ''
  form.credential_url = ''
  form.issue_date = ''
  form.expiry_date = ''
  form.sort_order = 0
  formError.value = ''
  editingId.value = null
}

function openAddModal() {
  resetForm()
  showModal.value = true
}

function openEditModal(cert: Certificate) {
  resetForm()
  editingId.value = cert.id
  form.name = cert.name
  form.issuer = cert.issuer
  form.description = cert.description || ''
  form.credential_url = cert.credential_url || ''
  form.issue_date = cert.issue_date
  form.expiry_date = cert.expiry_date || ''
  form.sort_order = cert.sort_order
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function confirmDelete(cert: Certificate) {
  deletingCert.value = cert
  showDeleteConfirm.value = true
}

function validate(): boolean {
  if (!form.name.trim()) {
    formError.value = 'Nama sertifikat wajib diisi'
    return false
  }
  if (!form.issuer.trim()) {
    formError.value = 'Penerbit sertifikat wajib diisi'
    return false
  }
  if (!form.issue_date) {
    formError.value = 'Tanggal terbit wajib diisi'
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return
  saving.value = true
  try {
    const payload = {
      name: form.name,
      issuer: form.issuer,
      description: form.description || undefined,
      credential_url: form.credential_url || undefined,
      issue_date: form.issue_date,
      expiry_date: form.expiry_date || undefined,
      sort_order: form.sort_order,
    }

    if (editingId.value) {
      await api.put<{ data: Certificate }>(`/certificates/${editingId.value}`, payload)
    } else {
      await api.post<{ data: Certificate }>('/certificates', payload)
    }
    await fetchCertificates()
    closeModal()
  } catch {
    formError.value = 'Gagal menyimpan data. Silakan coba lagi.'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!deletingCert.value) return
  saving.value = true
  try {
    const token = useCookie('auth_token', { sameSite: 'lax' })
    await $fetch(`${apiBase}/certificates/${deletingCert.value.id}`, {
      method: 'DELETE',
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : undefined,
    })
    await fetchCertificates()
    showDeleteConfirm.value = false
    deletingCert.value = null
  } catch {
    /* ignore */
  } finally {
    saving.value = false
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
