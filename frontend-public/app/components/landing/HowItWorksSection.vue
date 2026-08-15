<template>
  <section id="how-it-works" class="bg-gray-50 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p v-reveal class="text-base font-semibold leading-7 text-indigo-600">Cara Kerja</p>
        <h2 v-reveal="{ delay: 80 }" class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Mulai dalam Hitungan Menit
        </h2>
        <p v-reveal="{ delay: 160 }" class="mt-4 text-lg leading-8 text-gray-600">
          Empat langkah sederhana untuk membangun portofolio bertenaga AI-mu.
        </p>
      </div>

      <div class="mx-auto mt-16 max-w-5xl">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            v-reveal="{ delay: i * 120, y: 20 }"
            class="card-lift relative text-center"
          >
            <div
              class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl shadow-sm"
              :class="[step.bgClass]"
            >
              <span class="text-xl font-bold" :class="step.textClass">{{ i + 1 }}</span>
            </div>
            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-900">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ step.desc }}</p>
            </div>
            <div
              v-if="i < steps.length - 1"
              class="hidden lg:block absolute top-8 left-[60%] h-0.5 w-[calc(80%)] bg-gradient-to-r to-transparent"
              :class="step.lineClass"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Hubungkan GitHub',
    desc: 'Tautkan repositori dan sinkronkan proyek secara instan.',
    bgClass: 'bg-indigo-100',
    textClass: 'text-indigo-600',
    lineClass: 'from-indigo-200',
  },
  {
    title: 'Sinkronkan Profil',
    desc: 'Hubungkan LinkedIn, Twitter, dan profil sosial lainnya.',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-600',
    lineClass: 'from-purple-200',
  },
  {
    title: 'AI Menghasilkan',
    desc: 'AI kami membangun portofolio dan CV-mu secara otomatis.',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-600',
    lineClass: 'from-emerald-200',
  },
  {
    title: 'Bagikan & Ekspor',
    desc: 'Bagikan portofolio dan ekspor CV-mu dalam satu klik.',
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-600',
    lineClass: 'from-amber-200',
  },
]
</script>
