<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto max-w-3xl space-y-6">
      <!-- Profile section -->
      <div class="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
        <div class="mb-6 flex items-center gap-4">
          <div class="relative">
            <img :src="user.avatar_url || ''" :alt="user.name" class="h-16 w-16 rounded-2xl object-cover ring-2 ring-zinc-700" />
            <button @click="navigateTo('/dashboard')" class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg border-2 border-zinc-950 bg-violet-600 text-white transition-colors hover:bg-violet-500">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </button>
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">{{ user.name }}</h2>
            <p class="text-sm text-zinc-500">GitHub terhubung</p>
          </div>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Nama Lengkap</label>
            <input type="text" v-model="form.name" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
            <input type="email" v-model="form.email" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Bio</label>
            <textarea v-model="form.bio" rows="3" class="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm leading-relaxed text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"></textarea>
            <p class="mt-1 text-right text-[10px] text-zinc-600">{{ form.bio.length }}/280 karakter</p>
          </div>
        </div>
      </div>

      <!-- Informasi Profesional -->
      <div class="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
        <h2 class="mb-1 text-sm font-semibold text-zinc-200">Informasi Profesional</h2>
        <p class="mb-5 text-xs text-zinc-500">Lengkapi informasi profesional untuk ditampilkan di portofolio dan CV.</p>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Posisi/Jabatan Target</label>
            <input type="text" v-model="form.job_title" placeholder="contoh: Senior Frontend Engineer" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700" />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Nomor Telepon</label>
            <input type="text" v-model="form.phone" placeholder="contoh: +62 812 3456 7890" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700" />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Lokasi/Kota</label>
            <input type="text" v-model="form.location" placeholder="contoh: Jakarta, Indonesia" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700" />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">Website Personal</label>
            <input type="text" v-model="form.website" placeholder="contoh: https://johndoe.dev" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700" />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-xs font-medium text-zinc-400">URL LinkedIn</label>
            <input type="text" v-model="form.linkedin" placeholder="contoh: https://linkedin.com/in/johndoe" class="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-700" />
          </div>
        </div>
      </div>

      <!-- Connected accounts -->
      <div class="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
        <h2 class="mb-1 text-sm font-semibold text-zinc-200">Akun Terhubung</h2>
        <p class="mb-5 text-xs text-zinc-500">Kelola koneksi platform untuk sinkronisasi portofolio.</p>

        <div class="space-y-3">
          <!-- GitHub -->
          <div class="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">GitHub</p>
                <p class="text-xs text-zinc-500">Terhubung dan siap sinkronisasi</p>
              </div>
            </div>
            <span class="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <span class="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              Terhubung
            </span>
          </div>

          <!-- GitLab -->
          <div class="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                <svg class="h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor"><path d="M23.955 13.587l-1.34-8.135a.847.847 0 00-1.622-.144l-1.265 3.793H4.272L3.007 5.308a.847.847 0 00-1.622.144L.045 13.587a.86.86 0 00.313.823l11.305 8.697a.847.847 0 001.067 0l11.305-8.697a.86.86 0 00.313-.823z"/></svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-zinc-300">GitLab</p>
                <p class="text-xs text-zinc-600">Sinkronkan repositori dan proyek dari GitLab</p>
              </div>
            </div>
            <button @click="auth.redirectOAuth('gitlab', apiBase)" class="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-white">
              Hubungkan
            </button>
          </div>
        </div>
      </div>

      <!-- AI Preferences -->
      <div class="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6">
        <h2 class="mb-1 text-sm font-semibold text-zinc-200">Preferensi AI</h2>
        <p class="mb-5 text-xs text-zinc-500">Kontrol bagaimana AI meringkas dan menyusun portofolio-mu.</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-zinc-300">Auto-summarize README</p>
              <p class="text-xs text-zinc-600">AI otomatis meringkas README saat sync repositori</p>
            </div>
            <button @click="toggle1 = !toggle1" :class="toggle1 ? 'bg-violet-600' : 'bg-zinc-700'" class="relative h-6 w-11 rounded-full transition-colors">
              <span :class="toggle1 ? 'translate-x-5' : ''" class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"></span>
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-zinc-300">Saran proyek unggulan</p>
              <p class="text-xs text-zinc-600">AI menyarankan repositori untuk ditandai sebagai unggulan</p>
            </div>
            <button @click="toggle2 = !toggle2" :class="toggle2 ? 'bg-violet-600' : 'bg-zinc-700'" class="relative h-6 w-11 rounded-full transition-colors">
              <span :class="toggle2 ? 'translate-x-5' : ''" class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"></span>
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-zinc-300">Generate CV otomatis</p>
              <p class="text-xs text-zinc-600">Susun CV berdasarkan data portofolio terbaru</p>
            </div>
            <button @click="toggle3 = !toggle3" :class="toggle3 ? 'bg-violet-600' : 'bg-zinc-700'" class="relative h-6 w-11 rounded-full transition-colors">
              <span :class="toggle3 ? 'translate-x-5' : ''" class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Save bar -->
      <div class="sticky bottom-0 flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-zinc-950/95 p-4 backdrop-blur-xl">
        <p class="text-xs text-zinc-500">Perubahan belum disimpan</p>
        <div class="flex gap-2">
          <button @click="navigateTo('/dashboard')" class="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white">
            Batal
          </button>
          <button @click="handleSave" :disabled="isSaving" class="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 disabled:opacity-50">
            {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string
const api = useApi()
const user = computed(() => auth.user ?? { name: '', email: '', bio: '', avatar_url: '' })

const form = reactive({
  name: '',
  email: '',
  bio: '',
  job_title: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
})

watchEffect(() => {
  if (auth.user) {
    form.name = auth.user.name || ''
    form.email = auth.user.email || ''
    form.bio = auth.user.bio || ''
    form.job_title = auth.user.job_title || ''
    form.phone = auth.user.phone || ''
    form.location = auth.user.location || ''
    form.website = auth.user.website || ''
    form.linkedin = auth.user.linkedin || ''
  }
})

const toggle1 = ref(true)
const toggle2 = ref(true)
const toggle3 = ref(false)
const isSaving = ref(false)

async function handleSave() {
  isSaving.value = true
  try {
    await api.put('/user', {
      name: form.name,
      email: form.email,
      bio: form.bio,
      job_title: form.job_title,
      phone: form.phone,
      location: form.location,
      website: form.website,
      linkedin: form.linkedin,
    })
    const { data } = await api.get<{ data: typeof auth.user }>('/user')
    auth.setUser(data)
    navigateTo('/dashboard')
  } catch {
  } finally {
    isSaving.value = false
  }
}
</script>
