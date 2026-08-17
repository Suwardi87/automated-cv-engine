<template>
  <section id="features" class="bg-[#040506] py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p v-reveal class="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[#55b3ff]">// Fitur Unggulan</p>
        <h2 v-reveal="{ delay: 80 }" class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Semua yang Kamu Butuhkan
        </h2>
        <p v-reveal="{ delay: 160 }" class="mt-4 text-lg leading-8 text-[#c8c8ca]">
          Platform terpadu yang menyatukan kehadiran profesionalmu dalam satu tempat.
        </p>
      </div>

      <div class="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, i) in features"
          :key="feature.title"
          v-reveal="{ delay: i * 80 }"
          class="card-lift group relative overflow-hidden rounded-xl border border-[#1e1f21] bg-[#0c0d0e] p-7 shadow-[rgb(22,23,25)_0px_0px_0px_1px,rgb(4,5,6)_0px_0px_0px_1px_inset] transition-colors hover:border-[#262728]"
        >
          <!-- Hover accent gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-[#55b3ff]/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

          <div class="relative">
            <div
              class="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border transition-colors"
              :class="[feature.borderClass, feature.bgClass]"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="feature.icon"></svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-white">{{ feature.title }}</h3>
            <p class="text-sm leading-relaxed text-[#8e8e90]">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'Integrasi GitHub',
    desc: 'Sinkronkan repositori, lacak commit, dan tampilkan kontribusi open-source secara otomatis.',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>',
    borderClass: 'border-[#55b3ff]/30',
    bgClass: 'bg-[#55b3ff]/10 text-[#55b3ff]',
  },
  {
    title: 'CV Berbasis AI',
    desc: 'Hasilkan CV profesional yang disesuaikan dengan keahlian dan pengalamanmu menggunakan AI.',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>',
    borderClass: 'border-[#55b3ff]/30',
    bgClass: 'bg-[#55b3ff]/10 text-[#55b3ff]',
  },
  {
    title: 'Sinkronisasi Sosial',
    desc: 'Hubungkan LinkedIn, Twitter, dan lainnya untuk membuat portofolio media sosial terpadu.',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>',
    borderClass: 'border-[#5fc992]/30',
    bgClass: 'bg-[#5fc992]/10 text-[#5fc992]',
  },
  {
    title: 'Portofolio Pintar',
    desc: 'Pameran proyek yang dikurasi AI yang menyoroti karya terbaikmu secara otomatis.',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>',
    borderClass: 'border-[#ffbc33]/30',
    bgClass: 'bg-[#ffbc33]/10 text-[#ffbc33]',
  },
  {
    title: 'Screenshot Otomatis',
    desc: 'Setiap proyek di-screenshot otomatis — recruiter langsung lihat preview website aslimu.',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>',
    borderClass: 'border-[#55b3ff]/30',
    bgClass: 'bg-[#55b3ff]/10 text-[#55b3ff]',
  },
  {
    title: 'Ekspor Satu Klik',
    desc: 'Ekspor portofolio dan CV-mu sebagai PDF, JSON, atau tautan yang bisa dibagikan dengan satu klik.',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>',
    borderClass: 'border-[#55b3ff]/30',
    bgClass: 'bg-[#55b3ff]/10 text-[#55b3ff]',
  },
]
</script>