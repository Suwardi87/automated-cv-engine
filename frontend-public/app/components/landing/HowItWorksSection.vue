<template>
  <section id="how-it-works" class="border-y border-[#1e1f21] bg-[#040506] py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p v-reveal class="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[#55b3ff]">// Cara Kerja</p>
        <h2 v-reveal="{ delay: 80 }" class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Mulai dalam Hitungan Menit
        </h2>
        <p v-reveal="{ delay: 160 }" class="mt-4 text-lg leading-8 text-[#c8c8ca]">
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
              class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border shadow-[rgb(22,23,25)_0px_0px_0px_1px,rgb(4,5,6)_0px_0px_0px_1px_inset]"
              :class="[step.borderClass, step.bgClass]"
            >
              <span class="font-mono text-xl font-bold" :class="step.textClass">{{ i + 1 }}</span>
            </div>
            <div class="mt-6">
              <h3 class="text-lg font-bold text-white">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#8e8e90]">{{ step.desc }}</p>
            </div>
            <div
              v-if="i < steps.length - 1"
              class="absolute left-[60%] top-8 hidden h-px w-[calc(80%)] bg-gradient-to-r to-transparent lg:block"
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
    borderClass: 'border-[#55b3ff]/40',
    bgClass: 'bg-[#55b3ff]/10',
    textClass: 'text-[#55b3ff]',
    lineClass: 'from-[#55b3ff]/50',
  },
  {
    title: 'Sinkronkan Profil',
    desc: 'Hubungkan LinkedIn, Twitter, dan profil sosial lainnya.',
    borderClass: 'border-[#55b3ff]/40',
    bgClass: 'bg-[#55b3ff]/10',
    textClass: 'text-[#55b3ff]',
    lineClass: 'from-[#55b3ff]/50',
  },
  {
    title: 'AI Menghasilkan',
    desc: 'AI kami membangun portofolio dan CV-mu secara otomatis.',
    borderClass: 'border-[#5fc992]/40',
    bgClass: 'bg-[#5fc992]/10',
    textClass: 'text-[#5fc992]',
    lineClass: 'from-[#5fc992]/50',
  },
  {
    title: 'Bagikan & Ekspor',
    desc: 'Bagikan portofolio dan ekspor CV-mu dalam satu klik.',
    borderClass: 'border-[#ffbc33]/40',
    bgClass: 'bg-[#ffbc33]/10',
    textClass: 'text-[#ffbc33]',
    lineClass: 'from-[#ffbc33]/50',
  },
]
</script>