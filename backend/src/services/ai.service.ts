import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CvData {
  profil: string;
  technicalSkills: string[];
  softSkills: string[];
  experiences: {
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    school: string;
    period: string;
    note: string;
  }[];
  organizations: {
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
  certificates: string[];
  portfolioLinks: string;
}

interface RepoDetail {
  title: string;
  is_featured?: boolean;
  tech_stack: string[] | null;
  ai_summary: string | null;
  repo_url: string;
  live_url: string | null;
  languages?: Record<string, number> | null;
  topics?: string[] | null;
  recent_commits?: { message: string; date: string; sha: string }[] | null;
  stars_count?: number;
  forks_count?: number;
  is_fork?: boolean;
  description?: string | null;
  last_pushed_at?: string;
}

interface GenerateCvParams {
  name: string;
  email: string;
  bio: string;
  repos: RepoDetail[];
}

@Injectable()
export class AiService implements OnModuleInit {
  private GoogleAI: any = null;
  private model: any = null;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const key = this.config.get<string>('ai.geminiKey');
    if (!key) return;
    try {
      const mod = await import('@google/generative-ai');
      this.GoogleAI = mod.GoogleGenerativeAI;
      const genAI = new this.GoogleAI(key);
      this.model = genAI.getGenerativeModel({
        model: this.config.get<string>('ai.geminiModel') || 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
        },
      });
    } catch {
      this.model = null;
    }
  }

  private escapeUserContent(text: string): string {
    return text
      .replace(/```/g, '\\`\\`\\`')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .slice(0, 8000);
  }

  private buildPrompt(params: GenerateCvParams): string {
    const repoText = params.repos
      .map((r) => {
        const featured = r.is_featured ? '★ UNGGULAN ' : '';
        const stack = (r.tech_stack || []).join(', ') || 'N/A';
        const langs = r.languages ? Object.keys(r.languages).join(', ') : '';
        const topics = (r.topics || []).join(', ');
        const commits = (r.recent_commits || []).map((c) => c.message).join('; ');
        const summary = r.ai_summary ? ': ' + this.escapeUserContent(r.ai_summary) : '';
        const stars = r.stars_count ? `★${r.stars_count}` : '';
        const forks = r.forks_count ? `⑂${r.forks_count}` : '';
        const meta = [stack, langs, topics, stars, forks].filter(Boolean).join(' | ');
        return `- ${featured}${r.title} (${meta})${summary}${commits ? '\n  Recent commits: ' + this.escapeUserContent(commits.slice(0, 500)) : ''}`;
      })
      .join('\n');

    return `Anda adalah asisten penulis CV profesional ATS (Applicant Tracking System). Tugas Anda adalah membuat CV dalam Bahasa Indonesia formal dengan format yang dioptimalkan untuk ATS.

GAYA PENULISAN:
- Gunakan kata kerja aktif bervariasi: "Mengembangkan", "Merancang", "Mengimplementasikan", "Mengintegrasikan", 
  "Mengoptimalkan", "Memimpin", "Menyusun"
- Setiap bullet point: [Aksi] + [Objek] + [Teknologi/Metode] + [Hasil/Dampak]
- Hindari kata klise: "bekerja keras", "bertanggung jawab", "team player"
- Gunakan istilah teknis spesifik
- Prioritaskan hasil konkret dan dampak terukur

PRIORITAS REPOSITORI:
- Repositori yang ditandai ★ UNGGULAN adalah proyek UTAMA yang harus dijadikan pengalaman prioritas tertinggi
- Buat pengalaman (experiences) dari repositori UNGGULAN terlebih dahulu sebelum yang lain
- Jika ada repositori dengan nama serupa (misal "mobile_damkar" dan "web-damkar"), gabungkan menjadi SATU pengalaman yang komprehensif
- Repositori non-unggulan hanya dilibutkan jika relevan untuk melengkapi

CONTOH BULLET POINT BAIK:
- "Mengembangkan REST API untuk sistem e-learning menggunakan Laravel, mengintegrasikan Midtrans payment gateway, dan mengelola role-based access control untuk 3 tipe pengguna"
- "Merancang database MySQL dengan 12 tabel relasional untuk sistem manajemen inventaris, mengoptimalkan query kompleks sehingga response time turun 40%"
- "Memimpin tim 5 developer dalam pengembangan aplikasi web, mengelola sprint mingguan menggunakan Git dan Trello, dan berhasil deliver project tepat waktu"

CONTOH BULLET POINT BURUK:
- "Membuat aplikasi dengan Laravel"
- "Bertanggung jawab sebagai developer"
- "Bekerja sama dengan tim"

BUAT CV UNTUK:
Nama: ${this.escapeUserContent(params.name)}
Email: ${this.escapeUserContent(params.email)}
Bio: ${this.escapeUserContent(params.bio || '-')}

REPOSITORI GITHUB:
${repoText || '- (belum ada repositori)'}

INSTRUKSI FORMAT OUTPUT:
Keluarkan JSON SAJA (tanpa markdown, tanpa komentar, tanpa teks lain):
{
  "profil": "2-3 kalimat profil profesional, sintesis dari semua project dan skill, personal (bukan template)",
  "technicalSkills": ["dikategorikan: Bahasa Pemrograman, Framework, Database, Tools, dll"],
  "softSkills": ["4-5 soft skill spesifik berdasarkan konteks project"],
  "experiences": [
    {
      "role": "posisi/peran",
      "company": "nama project",
      "period": "periode",
      "bullets": ["bullet dengan format Aksi + Objek + Teknologi + Hasil"]
    }
  ],
  "education": [],
  "organizations": [],
  "certificates": [],
  "portfolioLinks": "URL portfolio dan deskripsi singkat"
}

Gunakan data repositori sebagai dasar pengalaman. Repositori ★ UNGGULAN wajib menjadi experience utama.
Jika repositori tidak ada, buat profil berdasarkan bio saja (jangan buat experience palsu).
Jika tidak ada data organisasi/sertifikat, biarkan array kosong [].

Output JSON valid. JANGAN tambahkan apapun di luar JSON.`;
  }

  async generateCvContent(params: GenerateCvParams): Promise<CvData> {
    if (!this.model) return this.enhancedFallback(params);

    const prompt = this.buildPrompt(params);

    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text
          .replace(/```json\s*/gi, '')
          .replace(/```\s*$/gm, '')
          .replace(/```/g, '')
          .trim();

        const parsed = JSON.parse(cleaned);
        if (this.isValidCvData(parsed)) return parsed;
      } catch {
        /* retry with stricter prompt if needed */
      }
    }

    return this.enhancedFallback(params);
  }

  private isValidCvData(data: any): data is CvData {
    if (!data || typeof data !== 'object') return false;
    return (
      typeof data.profil === 'string' &&
      data.profil.length > 10 &&
      Array.isArray(data.technicalSkills) &&
      Array.isArray(data.softSkills) &&
      Array.isArray(data.experiences) &&
      Array.isArray(data.education) &&
      Array.isArray(data.organizations) &&
      Array.isArray(data.certificates) &&
      typeof data.portfolioLinks === 'string'
    );
  }

  private enhancedFallback(params: GenerateCvParams): CvData {
    const techStacks = [...new Set(params.repos.flatMap((r) => r.tech_stack || []))].filter(Boolean);
    const analysis = this.analyzeReposSimple(params.repos);

    const topRepos = [...params.repos]
      .sort((a, b) => {
        const featuredDiff = Number(b.is_featured ?? false) - Number(a.is_featured ?? false);
        if (featuredDiff !== 0) return featuredDiff;
        return (b.recent_commits?.length ?? 0) - (a.recent_commits?.length ?? 0);
      })
      .slice(0, 8);

    const experiences = this.buildExperiences(topRepos, analysis, techStacks);

    const allBullets = experiences.flatMap((e) => e.bullets);

    const profil = params.bio
      ? params.bio.slice(0, 500)
      : params.repos.length > 0
        ? `Lulusan/Sedang menempuh pendidikan di bidang Teknologi Informasi dengan pengalaman membangun ${params.repos.length}+ proyek perangkat lunak. Mahir dalam ${analysis.primaryTech.slice(0, 3).join(', ') || 'pengembangan full-stack'} dengan kemampuan problem-solving yang kuat dan pengalaman bekerja baik secara tim maupun individu. Tertarik pada peluang di bidang pengembangan web dan mobile.`
        : 'Belum ada data untuk ditampilkan. Silakan sinkronkan repositori GitHub atau lengkapi profil Anda.';

    return {
      profil,
      technicalSkills: techStacks.length > 0
        ? [...this.filterRelevantTechs(techStacks), 'Git & Version Control', 'REST API', 'Agile/Scrum']
        : ['Belum ada data skill. Sinkronkan repositori GitHub untuk mendeteksi tech stack.'],
      softSkills: [
        'Problem Solving & Analytical Thinking',
        'Adaptability & Fast Learning',
        'Team Collaboration & Communication',
        'Time Management & Prioritization',
        'Continuous Learning & Self-Motivation',
      ],
      experiences,
      education: [],
      organizations: [],
      certificates: [],
      portfolioLinks: params.repos.length > 0
        ? `Tersedia ${params.repos.length} repositori publik di GitHub yang mendemonstrasikan kemampuan praktis dalam arsitektur perangkat lunak, integrasi API, CI/CD, dan pengembangan fitur end-to-end.`
        : 'Belum ada repositori untuk ditampilkan.',
    };
  }

  private buildExperiences(
    repos: GenerateCvParams['repos'],
    analysis: ReturnType<AiService['analyzeReposSimple']>,
    techStacks: string[],
  ): CvData['experiences'] {

    const allCommitText = repos
      .flatMap((r) => (r.recent_commits || []).map((c) => c.message?.toLowerCase() || ''))
      .join(' ');

    const hasSignal = (patterns: RegExp[]): boolean => patterns.some((p) => p.test(allCommitText));
    const signals = {
      payment: hasSignal([/payment|midtrans|transaction|stripe/]),
      auth: hasSignal([/auth|login|role|permission|jwt|guard/]),
      ciCd: hasSignal([/ci\/?cd|deploy|docker|pipeline|workflow/]),
      notification: hasSignal([/fcm|firebase|push.?notif|websocket/]),
      reporting: hasSignal([/pdf|report|invoice|export|print/]),
      api: hasSignal([/api|endpoint|rest|graphql|swagger/]),
      realTime: hasSignal([/real.?time|live|map|monitor|dashboard/]),
      crud: hasSignal([/crud|create|update|delete|manage/]),
    };

    type ProjectType = {
      match: RegExp;
      role: string;
      company: string;
      bullets: (tech: string[], primary: string, summary: string | null) => string[];
    };

    const projectTypes: ProjectType[] = [
      {
        match: /pos|frozen.?pos|frozenfood|kasir|point.?of.?sale/i,
        role: 'Full-Stack Developer — Sistem POS',
        company: 'Sistem Point of Sale (POS)',
        bullets: (tech, primary) => {
          const b = [`Mengembangkan sistem Point of Sale (POS) full-stack dengan ${primary}, ${tech.slice(1, 3).join(', ')}, mendukung manajemen transaksi penjualan real-time`];
          if (signals.reporting) b.push(`Merancang modul laporan keuangan dan cetak struk/invoice berbasis PDF untuk pencatatan transaksi harian`);
          if (signals.payment) b.push(`Mengintegrasikan payment gateway untuk pemrosesan pembayaran yang aman dan otomatis`);
          if (signals.auth) b.push(`Mengimplementasikan sistem autentikasi berbasis role (admin, kasir, manajer) dengan kontrol akses granular`);
          b.push(`Membangun REST API untuk komunikasi antara front-end dan back-end dengan arsitektur yang scalable`);
          return b;
        },
      },
      {
        match: /damkar|pemadam|kebakaran|emergency/i,
        role: 'Software Developer — Instansi Pemerintah',
        company: 'Dinas Pemadam Kebakaran',
        bullets: (tech, primary, summary) => {
          const b = [`Mengembangkan sistem informasi manajemen kebakaran dan penanggulangan bencana berbasis web dengan ${primary}`];
          if (signals.realTime) b.push(`Membangun fitur peta monitoring real-time untuk pelacakan status kejadian dan distribusi unit pemadam`);
          if (signals.notification) b.push(`Mengimplementasikan push notification Firebase Cloud Messaging (FCM) untuk peringatan darurat pada aplikasi mobile`);
          if (summary) b.push(`Mengerjakan: ${summary.slice(0, 100)}`);
          else b.push(`Mengembangkan modul manajemen data kejadian, laporan operasional, dan dashboard analitik`);
          return b;
        },
      },
      {
        match: /pariwisata|wisata|tourism|koto/i,
        role: 'Web Developer — Pariwisata',
        company: 'Platform Pariwisata Kota',
        bullets: (tech, primary) => {
          const b = [`Membangun platform informasi pariwisata berbasis web dengan ${primary}, menampilkan destinasi, kuliner, dan akomodasi lokal`];
          b.push(`Mengembangkan sistem manajemen konten (CMS) untuk admin mengelola artikel, galeri, dan data destinasi secara dinamis`);
          if (signals.api) b.push(`Mendesain RESTful API untuk integrasi data pariwisata antar platform`);
          return b;
        },
      },
      {
        match: /jdih|peraturan|hukum|legal/i,
        role: 'Web Developer — Dokumentasi Hukum',
        company: 'Jaringan Dokumentasi dan Informasi Hukum',
        bullets: (tech, primary) => {
          const b = [`Mengembangkan sistem JDIH (Jaringan Dokumentasi dan Informasi Hukum) dengan ${primary} untuk digitalisasi peraturan daerah`];
          b.push(`Membangun fitur pencarian dan kategorisasi dokumen hukum dengan filter berdasarkan nomor, tahun, dan jenis peraturan`);
          return b;
        },
      },
      {
        match: /dispora|pemuda|olahraga|dp3p3kb|ldpi|kominfo|ppid|kelurahan|bansos|kependuduk|imunisasi|arsip/i,
        role: 'Software Developer — E-Government',
        company: 'Berbagai Instansi Pemerintah Daerah',
        bullets: (tech, primary, summary) => {
          const b = [`Mengembangkan aplikasi e-government dengan ${primary} untuk digitalisasi layanan publik dan transparansi administrasi`];
          if (signals.auth) b.push(`Mengimplementasikan sistem autentikasi dan otorisasi berbasis role untuk pegawai dan administratur sistem`);
          if (signals.crud) b.push(`Membangun modul CRUD untuk manajemen data dinamis (berita, layanan, galeri, pengaduan warga)`);
          if (summary) b.push(`Mengerjakan: ${summary.slice(0, 80)}`);
          return b;
        },
      },
      {
        match: /mobile|flutter|dart|android|ios|reservasi|restoran|restaurant/i,
        role: 'Mobile Developer',
        company: 'Aplikasi Mobile',
        bullets: (tech, primary, summary) => {
          const isFlutter = /dart|flutter/i.test(primary);
          const b = [isFlutter
            ? `Mengembangkan aplikasi mobile lintas-platform (Android & iOS) dengan Flutter/Dart untuk layanan informasi publik`
            : `Mengembangkan aplikasi mobile dengan ${primary} untuk reservasi dan manajemen layanan`];
          if (signals.notification) b.push(`Mengintegrasikan Firebase Cloud Messaging untuk push notification real-time`);
          if (summary) b.push(`Fungsionalitas: ${summary.slice(0, 100)}`);
          b.push(`Mengelola state management dan navigasi yang kompleks untuk pengalaman pengguna yang optimal`);
          return b;
        },
      },
      {
        match: /workflow|pipeline|ci.?cd|deploy|inventory|devops|automat/i,
        role: 'DevOps Engineer',
        company: 'Pipeline Otomasi & Deployment',
        bullets: (tech, primary) => {
          const b = [`Membangun pipeline otomasi CI/CD dengan ${primary} untuk testing, building, dan deployment otomatis`];
          if (signals.ciCd) b.push(`Mengonfigurasi Docker containerization dan Nginx reverse proxy untuk deployment yang reproducible`);
          b.push(`Mengelola infrastruktur server dan konfigurasi environment untuk staging dan production`);
          return b;
        },
      },
      {
        match: /laravel|elearning|course|msib|lms|quiz|blog|bookstore|charity/i,
        role: 'Web Developer — Platform Edukasi/Konten',
        company: 'Platform Web',
        bullets: (tech, primary) => {
          const b = [`Mengembangkan platform web berbasis ${primary} dengan fitur manajemen konten dan interaksi pengguna`];
          if (signals.auth) b.push(`Membangun sistem autentikasi pengguna dengan registrasi, login, dan manajemen profil`);
          b.push(`Mengimplementasikan operasi CRUD dan integrasi AJAX untuk pengalaman pengguna yang responsif`);
          return b;
        },
      },
      {
        match: /smartfarm|pertanian|pupuk|spk|ahp|maut|topsis|agro/i,
        role: 'Software Developer — Sistem Informasi',
        company: 'Sistem Pendukung Keputusan',
        bullets: (tech, primary) => {
          const b = [`Mengembangkan Sistem Pendukung Keputusan (SPK) dengan ${primary} menggunakan metode AHP/MAUT/TOPSIS untuk analisis data kompleks`];
          b.push(`Mengimplementasikan algoritma perhitungan kriteria dan pembobotan untuk rekomendasi keputusan yang akurat`);
          return b;
        },
      },
      {
        match: /klinik|clinic|health|medical|absen|absensi/i,
        role: 'Software Developer — Sistem Informasi',
        company: 'Sistem Informasi Manajemen',
        bullets: (tech, primary) => {
          const b = [`Mengembangkan Sistem Informasi Manajemen (SIM) berbasis ${primary} untuk operasional klinik/instansi`];
          b.push(`Membangun modul manajemen data pasien/pegawai, penjadwalan, dan pelaporan terintegrasi`);
          return b;
        },
      },
      {
        match: /cv.?maker|portfolio|cv.?engine|resume|ats/i,
        role: 'Full-Stack Developer — SaaS Platform',
        company: 'Platform SaaS',
        bullets: (tech, primary) => {
          const b = [`Mengembangkan platform SaaS (Software as a Service) dengan ${primary} untuk generasi CV profesional berbasis AI`];
          b.push(`Mengintegrasikan AI/ML API untuk analisis data otomatis dan pembuatan konten yang dioptimalkan ATS`);
          b.push(`Membangun sistem autentikasi OAuth (GitHub, GitLab) dan sinkronisasi data repository secara real-time`);
          return b;
        },
      },
    ];

    const classifyRepo = (repo: GenerateCvParams['repos'][number]): ProjectType | null => {
      const title = repo.title.toLowerCase();
      const summary = (repo.ai_summary || '').toLowerCase();
      for (const pt of projectTypes) {
        if (pt.match.test(title) || pt.match.test(summary)) return pt;
      }
      return null;
    };

    const classified = repos.map((r) => ({ repo: r, type: classifyRepo(r) }));
    const matched = classified.filter((c) => c.type !== null) as { repo: typeof repos[number]; type: ProjectType }[];
    const unmatched = classified.filter((c) => c.type === null).map((c) => c.repo);

    const seenTypes = new Set<string>();
    const experiences: CvData['experiences'] = [];

    for (const { repo, type } of matched) {
      if (seenTypes.has(type.role)) continue;
      seenTypes.add(type.role);
      const tech = (repo.tech_stack || []).filter(Boolean);
      const primary = tech[0] || 'teknologi web modern';
      const summary = repo.ai_summary || null;
      const bullets = type.bullets(tech, primary, summary);
      if (bullets.length > 0) {
        experiences.push({
          role: type.role,
          company: type.company,
          period: this.derivePeriod([repo]),
          bullets,
        });
      }
    }

    if (unmatched.length > 0 && experiences.length < 3) {
      const tech = [...new Set(unmatched.flatMap((r) => r.tech_stack || []))].filter(Boolean);
      const primary = tech[0] || 'teknologi modern';
      experiences.push({
        role: this.determineRole(techStacks),
        company: 'Berbagai Proyek Pengembangan Web',
        period: this.derivePeriod(unmatched),
        bullets: [
          `Mengembangkan ${unmatched.length}+ aplikasi web dengan ${primary}, ${tech.slice(1, 3).join(', ')}`,
          `Mengimplementasikan best practices pengembangan perangkat lunak termasuk version control (Git) dan struktur kode yang modular`,
        ],
      });
    }

    const totalCommits = repos.reduce((sum, r) => sum + (r.recent_commits?.length ?? 0), 0);
    if (experiences.length > 0 && totalCommits > 0) {
      experiences[0].bullets.unshift(
        `Bertanggung jawab atas pengembangan ${repos.length}+ proyek perangkat lunak dengan total ${totalCommits}+ commit, mencakup analisis kebutuhan, desain arsitektur, implementasi, hingga deployment`,
      );
    }

    return experiences.slice(0, 3);
  }

  private determineRole(techStacks: string[]): string {
    const hasFrontend = techStacks.some((t) => /vue|react|next|nuxt|angular/i.test(t));
    const hasBackend = techStacks.some((t) => /go|php|laravel|node|express|nest|django|spring/i.test(t));
    const hasMobile = techStacks.some((t) => /dart|flutter|kotlin|swift/i.test(t));
    if (hasFrontend && hasBackend) return 'Full-Stack Developer';
    if (hasMobile) return 'Mobile Developer';
    if (hasFrontend) return 'Front-End Developer';
    if (hasBackend) return 'Back-End Developer';
    return 'Software Developer';
  }

  private derivePeriod(repos: GenerateCvParams['repos']): string {
    if (repos.length === 0) return 'Terkini';
    const dates = repos
      .map((r) => r.last_pushed_at ? new Date(r.last_pushed_at) : null)
      .filter((d): d is Date => d !== null && !isNaN(d.getTime()));
    if (dates.length === 0) return 'Terkini';
    const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
    const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
    const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getFullYear()}`;
    if (earliest.getFullYear() === latest.getFullYear() && earliest.getMonth() === latest.getMonth()) {
      return fmt(latest);
    }
    return `${fmt(earliest)} — ${fmt(latest)}`;
  }

  private analyzeReposSimple(repos: any[]) {
    if (!repos || repos.length === 0) {
      return {
        allLanguages: {},
        primaryTech: [],
        totalStars: 0,
        totalForks: 0,
      };
    }

    // Aggregate all languages
    const allLanguages: Record<string, number> = {};
    let totalStars = 0;
    let totalForks = 0;

    repos.forEach(repo => {
      totalStars += repo.stars_count ?? 0;
      totalForks += repo.forks_count ?? 0;
      
      if (repo.languages) {
        Object.entries(repo.languages).forEach(([lang, count]: [string, unknown]) => {
          const numCount = typeof count === 'number' ? count : 0;
          allLanguages[lang] = (allLanguages[lang] || 0) + numCount;
        });
      }
    });

    // Determine primary technologies (top 3 by usage)
    const sortedLangs = Object.entries(allLanguages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([lang]) => lang);

    return {
      allLanguages,
      primaryTech: sortedLangs,
      totalStars,
      totalForks,
    };
  }

  private filterRelevantTechs(techs: string[]): string[] {
    const irrelevant = /^(c$|c\+\+|cmake|makefile|objective-c|dart-generated|llvm|assembly|go template|plpgsql|hack|less|scss|dockerfile|shell$)/i;
    const priority = /^(vue|react|next|nuxt|angular|svelte|php|laravel|go|node|typescript|javascript|python|dart|flutter|kotlin|swift|java|mysql|postgresql|mongodb|redis|docker|kubernetes|aws|nginx|tailwind|bootstrap|express|nestjs|django|flask|spring)/i;
    const filtered = techs.filter((t) => !irrelevant.test(t.trim()));
    const sorted = filtered.sort((a, b) => {
      const aP = priority.test(a.trim()) ? 0 : 1;
      const bP = priority.test(b.trim()) ? 0 : 1;
      return aP - bP;
    });
    return [...new Set(sorted.map((t) => t.trim()))].slice(0, 15);
  }

  private cleanDescription(description: string): string {
    return description.replace(/[^\w\s.-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
  }

  async summarizeReadme(raw: string): Promise<string | null> {
    if (!this.model || !raw) return null;
    const prompt = `Summarize the following GitHub README in 2-3 sentences in Bahasa Indonesia. Focus on: what the project does, key technologies used, and main features. Keep it factual and concise.

[README START]
${this.escapeUserContent(raw.slice(0, 8000))}
[README END]

Output: a single paragraph summary in Bahasa Indonesia only, no labels.`;
    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().trim();
      return text.length > 20 ? text.slice(0, 1000) : null;
    } catch {
      return null;
    }
  }
}