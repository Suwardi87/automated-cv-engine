<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/dashboard')" class="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:text-white">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
          <div>
            <p class="text-sm font-semibold text-zinc-200">Curriculum Vitae</p>
            <p class="text-xs text-zinc-500">Dihasilkan oleh AI berdasarkan data GitHub</p>
          </div>
        </div>
        <div>
          <button @click="generateAndDownload" :disabled="loading" class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 disabled:opacity-50">
            <svg v-if="loading" class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            {{ loading ? pdfStage : 'Generate & Download PDF' }}
          </button>
        </div>
      </div>

      <div ref="cvContent" class="overflow-hidden rounded-2xl border border-zinc-800/60 bg-white shadow-2xl shadow-black/40">
        <div class="mx-auto max-w-[800px] p-10 lg:p-14">
          <div class="mb-6 text-center">
            <h1 class="text-3xl font-bold tracking-tight text-zinc-900">{{ cv.name || 'CV Saya' }}</h1>
            <p class="mt-2 text-xs text-zinc-500">{{ cv.email || '' }}</p>
          </div>

          <CvSectionBlock title="PROFIL">
            <p class="text-xs leading-relaxed text-zinc-700">{{ cv.profil || 'Memuat data...' }}</p>
          </CvSectionBlock>

          <CvSectionBlock title="KEAHLIAN TEKNIS">
            <CvSkillList :items="cv.technicalSkills" />
          </CvSectionBlock>

          <CvSectionBlock title="KEAHLIAN NON-TEKNIS">
            <CvBulletList :items="cv.softSkills" />
          </CvSectionBlock>

          <CvSectionBlock v-if="cv.experiences.length" title="PENGALAMAN & PROYEK">
            <CvExperienceItem
              v-for="exp in cv.experiences"
              :key="exp.role + exp.company"
              :role="exp.role"
              :company="exp.company"
              :period="exp.period"
              :bullets="exp.bullets"
            />
          </CvSectionBlock>

          <CvSectionBlock v-if="cv.education.length" title="PENDIDIKAN">
            <CvEducationItem
              v-for="edu in cv.education"
              :key="edu.school"
              :degree="edu.degree"
              :school="edu.school"
              :period="edu.period"
              :note="edu.note"
            />
          </CvSectionBlock>

          <CvSectionBlock v-if="cv.organizations.length" title="PENGALAMAN ORGANISASI">
            <CvExperienceItem
              v-for="org in cv.organizations"
              :key="org.role + org.company"
              :role="org.role"
              :company="org.company"
              :period="org.period"
              :bullets="org.bullets"
            />
          </CvSectionBlock>

          <CvSectionBlock v-if="cv.certificates.length" title="SERTIFIKAT & PELATIHAN">
            <CvBulletList :items="cv.certificates" />
          </CvSectionBlock>

          <CvSectionBlock v-if="cv.portfolioLinks" title="PORTOFOLIO ONLINE">
            <p class="text-xs text-zinc-700">{{ cv.portfolioLinks }}</p>
          </CvSectionBlock>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const loading = ref(false)
const pdfStage = ref('')
const user = computed(() => auth.user ?? { name: '', email: '', bio: '' })
const cvContent = ref<HTMLDivElement | null>(null)

interface CvData {
  name: string
  email: string
  profil: string
  technicalSkills: string[]
  softSkills: string[]
  experiences: { role: string; company: string; period: string; bullets: string[] }[]
  education: { degree: string; school: string; period: string; note: string }[]
  organizations: { role: string; company: string; period: string; bullets: string[] }[]
  certificates: string[]
  portfolioLinks: string
}

const cv = reactive<CvData>({
  name: '',
  email: '',
  profil: '',
  technicalSkills: [],
  softSkills: [],
  experiences: [],
  education: [],
  organizations: [],
  certificates: [],
  portfolioLinks: '',
})

onMounted(() => {
  cv.name = user.value.name
  cv.email = user.value.email
})

async function generateAndDownload() {
  loading.value = true
  pdfStage.value = 'AI Memproses CV...'

  try {
    const res = await useApi().post<{ success: boolean; data: CvData }>('/cv/generate')
    const data = res?.data ?? res
    Object.assign(cv, data)
    cv.name = user.value.name || data.name || ''
    cv.email = user.value.email || data.email || ''

    await nextTick()

    const element = cvContent.value
    if (!element) throw new Error('CV element not found')

    pdfStage.value = 'Menyiapkan PDF...'

    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    })

    const imgData = canvas.toDataURL('image/png')
    const pageWidthMm = 210
    const pageHeightMm = 297
    const imgWidthMm = (canvas.width * 25.4) / 192
    const imgHeightMm = (canvas.height * 25.4) / 192
    const scale = Math.min(pageWidthMm / imgWidthMm, 1)
    const scaledWidthMm = imgWidthMm * scale
    const scaledHeightMm = imgHeightMm * scale

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    pdf.setProperties({
      title: `CV - ${cv.name}`,
      author: cv.name,
      subject: 'Curriculum Vitae',
      creator: 'OmniSync CV Generator',
    })

    const verticalPages = Math.ceil(scaledHeightMm / pageHeightMm)

    for (let page = 0; page < verticalPages; page++) {
      if (page > 0) pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, -(page * pageHeightMm), scaledWidthMm, scaledHeightMm)
    }

    pdf.save(`CV-${cv.name || 'Pengguna'}.pdf`)
  } catch (err) {
    console.error('Gagal generate CV:', err)
    pdfStage.value = 'Gagal! Coba lagi'
    await new Promise(r => setTimeout(r, 2000))
  } finally {
    loading.value = false
    pdfStage.value = ''
  }
}
</script>
