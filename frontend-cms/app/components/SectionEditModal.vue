<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-zinc-800/60 px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400" v-html="sectionMeta.icon"></div>
              <div>
                <h2 class="text-sm font-semibold text-zinc-100">{{ isEdit ? 'Edit' : 'Tambah' }} {{ sectionMeta.label }}</h2>
                <p class="text-xs text-zinc-500">{{ isEdit ? 'Perbarui data' : 'Tambah data baru' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="isEdit"
                @click="confirmDelete = !confirmDelete"
                class="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/30"
              >
                <svg class="h-3.5 w-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Hapus
              </button>
              <button @click="close" class="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Delete confirmation -->
          <div v-if="confirmDelete" class="border-b border-red-900/30 bg-red-950/20 px-6 py-4">
            <p class="text-sm text-red-300">Yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div class="mt-3 flex gap-2">
              <button @click="handleDelete" :disabled="deleting" class="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50">
                {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
              </button>
              <button @click="confirmDelete = false" class="rounded-lg border border-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-800">
                Batal
              </button>
            </div>
          </div>

          <!-- Form body -->
          <div class="max-h-[60vh] overflow-y-auto px-6 py-5">
            <div class="space-y-4">
              <div
                v-for="field in fields"
                :key="field.name"
              >
                <!-- Text / Date / URL -->
                <div v-if="['text', 'date', 'url'].includes(field.type)">
                  <label class="mb-1.5 block text-xs font-medium text-zinc-400">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-400">*</span>
                  </label>
                  <input
                    v-model="formData[field.name]"
                    :type="field.type"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    :disabled="isFieldDisabled(field)"
                    class="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </div>

                <!-- Checkbox / Toggle -->
                <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="formData[field.name] = !formData[field.name]"
                    class="relative h-5 w-9 rounded-full transition-colors"
                    :class="formData[field.name] ? 'bg-violet-600' : 'bg-zinc-700'"
                  >
                    <span class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform" :class="{ 'translate-x-4': formData[field.name] }"></span>
                  </button>
                  <span class="text-sm text-zinc-300">{{ field.label }}</span>
                </div>

                <!-- RichTextEditor + AI Improve -->
                <div v-else-if="field.type === 'richtext'">
                  <div class="mb-1.5 flex items-center justify-between">
                    <label class="block text-xs font-medium text-zinc-400">
                      {{ field.label }}
                    </label>
                    <button
                      v-if="field.aiContext"
                      type="button"
                      @click="handleImprove(field)"
                      :disabled="improving === field.name || !formData[field.name]"
                      class="flex items-center gap-1 rounded-md border border-violet-900/50 bg-violet-950/30 px-2 py-1 text-[10px] font-medium text-violet-400 transition-colors hover:bg-violet-900/30 disabled:opacity-30"
                    >
                      <svg v-if="improving === field.name" class="h-3 w-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      <svg v-else class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                      {{ improving === field.name ? 'Memproses...' : 'AI Improve' }}
                    </button>
                  </div>
                  <RichTextEditor
                    :model-value="formData[field.name] || ''"
                    @update:model-value="formData[field.name] = $event"
                    :placeholder="field.placeholder"
                  />
                </div>
              </div>
            </div>

            <!-- Error message -->
            <div v-if="formError" class="mt-4 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-2.5">
              <p class="text-xs text-red-400">{{ formError }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 border-t border-zinc-800/60 px-6 py-4">
            <button @click="close" class="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800">
              Batal
            </button>
            <button
              @click="handleSave"
              :disabled="saving || !isValid"
              class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg v-if="saving" class="h-3.5 w-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              {{ saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface SectionConfig {
  key: string
  label: string
  icon: string
  editTo: string
  emptyText: string
  endpoint: string
}

interface FieldDef {
  name: string
  label: string
  type: 'text' | 'date' | 'checkbox' | 'richtext' | 'url'
  required?: boolean
  placeholder?: string
  aiContext?: string
  disableWhen?: { field: string; value: boolean }
}

const props = defineProps<{
  show: boolean
  section: SectionConfig | null
  item: any | null
}>()

const emit = defineEmits<{
  close: []
  saved: [sectionKey: string]
  deleted: [sectionKey: string]
}>()

const api = useApi()
const saving = ref(false)
const deleting = ref(false)
const improving = ref<string | null>(null)
const formError = ref('')
const confirmDelete = ref(false)
const formData = ref<Record<string, any>>({})

const isEdit = computed(() => !!props.item)

const fieldSchemas: Record<string, FieldDef[]> = {
  education: [
    { name: 'institution', label: 'Institusi', type: 'text', required: true, placeholder: 'Nama universitas/sekolah' },
    { name: 'degree', label: 'Gelar', type: 'text', required: true, placeholder: 'S1, D3, SMA...' },
    { name: 'field_of_study', label: 'Bidang Studi', type: 'text', placeholder: 'Informatika, Ekonomi...' },
    { name: 'start_date', label: 'Tanggal Mulai', type: 'date', required: true },
    { name: 'end_date', label: 'Tanggal Selesai', type: 'date', placeholder: 'Kosongkan jika masih berlangsung' },
    { name: 'description', label: 'Deskripsi', type: 'richtext', placeholder: 'GPA, prestasi, organisasi...', aiContext: 'deskripsi pendidikan - institusi, gelar, dan bidang studi' },
  ],
  'work-experience': [
    { name: 'company', label: 'Perusahaan', type: 'text', required: true, placeholder: 'contoh: PT Teknologi Maju' },
    { name: 'position', label: 'Posisi', type: 'text', required: true, placeholder: 'contoh: Frontend Engineer' },
    { name: 'location', label: 'Lokasi', type: 'text', placeholder: 'contoh: Jakarta, Indonesia' },
    { name: 'start_date', label: 'Tanggal Mulai', type: 'date' },
    { name: 'end_date', label: 'Tanggal Selesai', type: 'date', disableWhen: { field: 'is_current', value: true } },
    { name: 'is_current', label: 'Saat ini masih bekerja', type: 'checkbox' },
    { name: 'description', label: 'Deskripsi', type: 'richtext', placeholder: 'Deskripsikan tanggung jawab dan pencapaian...', aiContext: 'deskripsi pengalaman kerja profesional' },
    { name: 'highlights', label: 'Poin Penting', type: 'richtext', placeholder: 'Tulis poin-poin penting...', aiContext: 'pencapaian dan kontribusi di pekerjaan' },
  ],
  certificates: [
    { name: 'name', label: 'Nama Sertifikat', type: 'text', required: true, placeholder: 'Contoh: AWS Solutions Architect' },
    { name: 'issuer', label: 'Penerbit', type: 'text', required: true, placeholder: 'Contoh: Amazon Web Services' },
    { name: 'issue_date', label: 'Tanggal Terbit', type: 'date', required: true },
    { name: 'expiry_date', label: 'Tanggal Kadaluarsa', type: 'date' },
    { name: 'credential_url', label: 'URL Kredensial', type: 'url', placeholder: 'https://credential.example.com/verify/...' },
    { name: 'description', label: 'Deskripsi', type: 'richtext', placeholder: 'Deskripsi singkat tentang sertifikat', aiContext: 'deskripsi sertifikat profesional' },
  ],
  organizations: [
    { name: 'name', label: 'Nama Organisasi', type: 'text', required: true, placeholder: 'contoh: Himpunan Mahasiswa Teknik Informatika' },
    { name: 'role', label: 'Jabatan/Peran', type: 'text', required: true, placeholder: 'contoh: Ketua Bidang Kaderisasi' },
    { name: 'start_date', label: 'Tanggal Mulai', type: 'date' },
    { name: 'end_date', label: 'Tanggal Selesai', type: 'date', disableWhen: { field: 'is_current', value: true } },
    { name: 'is_current', label: 'Masih Aktif', type: 'checkbox' },
    { name: 'description', label: 'Deskripsi', type: 'richtext', placeholder: 'Deskripsikan peran dan kontribusi...', aiContext: 'deskripsi pengalaman organisasi' },
    { name: 'highlights', label: 'Pencapaian/Kegiatan', type: 'richtext', placeholder: 'Tulis poin pencapaian...', aiContext: 'pencapaian dan kontribusi di organisasi' },
  ],
}

const sectionMetaMap: Record<string, { label: string; icon: string }> = {
  education: { label: 'Pendidikan', icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>' },
  'work-experience': { label: 'Pengalaman Kerja', icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
  certificates: { label: 'Sertifikat', icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>' },
  organizations: { label: 'Organisasi', icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>' },
}

const fields = computed<FieldDef[]>(() => {
  if (!props.section) return []
  return fieldSchemas[props.section.key] || []
})

const sectionMeta = computed(() => {
  if (!props.section) return { label: '', icon: '' }
  return sectionMetaMap[props.section.key] || { label: props.section.label, icon: '' }
})

const isValid = computed(() => {
  for (const f of fields.value) {
    if (f.required && !formData.value[f.name]) return false
  }
  return true
})

function isFieldDisabled(field: FieldDef): boolean {
  if (!field.disableWhen) return false
  return formData.value[field.disableWhen.field] === field.disableWhen.value
}

function initForm() {
  formError.value = ''
  confirmDelete.value = false
  if (props.item) {
    formData.value = { ...props.item }
    if (formData.value.start_date) formData.value.start_date = String(formData.value.start_date).slice(0, 10)
    if (formData.value.end_date) formData.value.end_date = String(formData.value.end_date).slice(0, 10)
    if (formData.value.issue_date) formData.value.issue_date = String(formData.value.issue_date).slice(0, 10)
    if (formData.value.expiry_date) formData.value.expiry_date = String(formData.value.expiry_date).slice(0, 10)
  } else {
    formData.value = {}
    for (const f of fields.value) {
      if (f.type === 'checkbox') formData.value[f.name] = false
      else formData.value[f.name] = ''
    }
  }
}

watch(() => props.show, (val) => {
  if (val) initForm()
})

watch(() => props.section, () => {
  if (props.show) initForm()
})

watch(() => formData.value.is_current, (val) => {
  if (val && formData.value.end_date) formData.value.end_date = ''
})

async function handleImprove(field: FieldDef) {
  if (!field.aiContext) return
  improving.value = field.name
  try {
    const res = await api.post<{ success: boolean; data: { improved: string } }>('/ai/improve', {
      text: formData.value[field.name] || '',
      context: field.aiContext,
    })
    if (res?.data?.improved) {
      formData.value[field.name] = res.data.improved
    }
  } catch {
  } finally {
    improving.value = null
  }
}

function buildPayload(): Record<string, any> {
  const payload: Record<string, any> = {}
  for (const f of fields.value) {
    let val = formData.value[f.name]
    if (f.type === 'date') {
      if (val && typeof val === 'string' && val.length > 0) {
        payload[f.name] = new Date(val + 'T00:00:00').toISOString()
      } else {
        payload[f.name] = null
      }
    } else if (f.type === 'text' || f.type === 'url') {
      payload[f.name] = val && String(val).trim() ? String(val).trim() : null
    } else if (f.type === 'checkbox') {
      payload[f.name] = !!val
    } else {
      payload[f.name] = val ?? ''
    }
  }
  if (formData.value.is_current) payload.end_date = null
  return payload
}

async function handleSave() {
  if (!props.section) return
  if (!isValid.value) {
    formError.value = 'Mohon lengkapi semua field yang wajib diisi'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const payload = buildPayload()
    if (isEdit.value && props.item?.id) {
      await api.put(`${props.section.endpoint}/${props.item.id}`, payload)
    } else {
      await api.post(props.section.endpoint, payload)
    }
    emit('saved', props.section.key)
    emit('close')
  } catch (err: any) {
    formError.value = err?.data?.message || 'Gagal menyimpan data'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!props.section || !props.item?.id) return
  deleting.value = true
  try {
    await api.del(`${props.section.endpoint}/${props.item.id}`)
    emit('deleted', props.section.key)
    emit('close')
  } catch (err: any) {
    formError.value = err?.data?.message || 'Gagal menghapus data'
  } finally {
    deleting.value = false
  }
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
