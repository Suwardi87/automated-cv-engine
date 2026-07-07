export interface Repo {
  id: number
  title: string
  slug: string
  description: string
  repo_url: string
  live_url: string | null
  tech_stack: string[]
  ai_summary: string
  is_featured: boolean
  stars: number
  forks: number
  last_pushed_at: string
  source: 'github' | 'gitlab'
}

export interface User {
  name: string
  username: string
  email: string
  bio: string
  avatar_url: string
  location: string
  company: string
  blog: string
  followers: number
  following: number
  public_repos: number
}

export interface MediaItem {
  id: number
  platform: string
  media_type: string
  media_url: string
  thumbnail_url: string
  caption: string
  posted_at: string
  likes: number
  comments: number
}

export const mockUser: User = {
  name: 'Suwardi',
  username: 'suwardi87',
  email: 'suwardi@example.com',
  bio: 'Full-stack developer dengan fokus pada sistem terdistribusi dan developer experience. 8+ tahun membangun produk dari nol.',
  avatar_url: 'https://avatars.githubusercontent.com/u/12345678?v=4',
  location: 'Jakarta, Indonesia',
  company: 'OmniSync',
  blog: 'https://suwardi.dev',
  followers: 248,
  following: 89,
  public_repos: 42
}

export const mockRepos: Repo[] = [
  {
    id: 1,
    title: 'automated-cv-engine',
    slug: 'automated-cv-engine',
    description: 'Platform portofolio terpadu dengan pembuatan CV berbasis AI. Sinkron GitHub, generate CV profesional dalam hitungan detik.',
    repo_url: 'https://github.com/suwardi87/automated-cv-engine',
    live_url: 'https://cv.suwardi.dev',
    tech_stack: ['NestJS', 'Nuxt 4', 'PostgreSQL', 'Redis', 'Docker'],
    ai_summary: 'Sistem monorepo full-stack yang menggabungkan sinkronisasi GitHub, AI summarization, dan generasi CV otomatis. Arsitektur modular dengan 6 modul independen.',
    is_featured: true,
    stars: 124,
    forks: 18,
    last_pushed_at: '2026-06-22T10:30:00Z',
    source: 'github'
  },
  {
    id: 2,
    title: 'realtime-dashboard',
    slug: 'realtime-dashboard',
    description: 'Dashboard real-time untuk monitoring infrastruktur dengan WebSocket dan grafik live.',
    repo_url: 'https://github.com/suwardi87/realtime-dashboard',
    live_url: 'https://status.suwardi.dev',
    tech_stack: ['Vue 3', 'Go', 'ClickHouse', 'WebSocket'],
    ai_summary: 'Dashboard monitoring performa dengan latensi sub-100ms. Menggunakan ClickHouse untuk time-series dan WebSocket untuk push updates.',
    is_featured: true,
    stars: 89,
    forks: 7,
    last_pushed_at: '2026-06-15T08:00:00Z',
    source: 'github'
  },
  {
    id: 3,
    title: 'edge-cache-proxy',
    slug: 'edge-cache-proxy',
    description: 'Cache proxy ringan untuk edge computing. Drop-in replacement untuk Varnish dengan konfigurasi YAML.',
    repo_url: 'https://github.com/suwardi87/edge-cache-proxy',
    live_url: null,
    tech_stack: ['Rust', 'Tokio', 'Redis'],
    ai_summary: 'Proxy caching berperforma tinggi yang ditulis dalam Rust. Throughput 3x lebih cepat dari Varnish pada benchmark lokal.',
    is_featured: false,
    stars: 56,
    forks: 4,
    last_pushed_at: '2026-05-28T14:20:00Z',
    source: 'github'
  },
  {
    id: 4,
    title: 'mobile-damkar',
    slug: 'mobile-damkar',
    description: 'Aplikasi mobile untuk pemadam kebakaran dengan tracking real-time dan anti-spoof GPS.',
    repo_url: 'https://github.com/suwardi87/mobile-damkar',
    live_url: null,
    tech_stack: ['Flutter', 'Dart', 'Firebase', 'Google Maps'],
    ai_summary: 'Aplikasi tracking armada darurat dengan verifikasi anti-spoof GPS. Terintegrasi dengan sistem dispatch existing.',
    is_featured: false,
    stars: 34,
    forks: 2,
    last_pushed_at: '2026-05-10T16:45:00Z',
    source: 'github'
  },
  {
    id: 5,
    title: 'workflow-vibe-code',
    slug: 'workflow-vibe-code',
    description: 'Framework commit-first pipeline untuk AI-assisted development. Auto SemVer, changelog, test runner.',
    repo_url: 'https://github.com/suwardi87/workflow-vibe-code',
    live_url: 'https://vibecode.dev',
    tech_stack: ['Bash', 'Python', 'Docker', 'GitHub Actions'],
    ai_summary: 'CLI framework yang membungkus siklus development jadi pipeline aman: commit-first, auto-test, security scan, deploy.',
    is_featured: false,
    stars: 67,
    forks: 11,
    last_pushed_at: '2026-06-01T09:15:00Z',
    source: 'github'
  },
  {
    id: 6,
    title: 'vector-search-engine',
    slug: 'vector-search-engine',
    description: 'Mesin pencari semantic berbasis vector embedding untuk dokumentasi teknis.',
    repo_url: 'https://github.com/suwardi87/vector-search-engine',
    live_url: null,
    tech_stack: ['Python', 'FastAPI', 'pgvector', 'OpenAI'],
    ai_summary: 'Search engine yang menggunakan embedding vector untuk pencarian semantik. Index 100K dokumen dengan latensi 50ms.',
    is_featured: false,
    stars: 42,
    forks: 6,
    last_pushed_at: '2026-04-20T11:30:00Z',
    source: 'github'
  },
  {
    id: 7,
    title: 'infra-terraform-modules',
    slug: 'gitlab-infra-terraform-modules',
    description: 'Koleksi modul Terraform reusable untuk provisioning infrastruktur multi-cloud.',
    repo_url: 'https://gitlab.com/suwardi87/infra-terraform-modules',
    live_url: null,
    tech_stack: ['Terraform', 'AWS', 'GCP', 'HCL'],
    ai_summary: 'Modul infrastruktur sebagai kode yang dipakai tim DevOps. Format modul standar dengan automated plan/apply via CI.',
    is_featured: true,
    stars: 38,
    forks: 9,
    last_pushed_at: '2026-06-19T13:00:00Z',
    source: 'gitlab'
  },
  {
    id: 8,
    title: 'homelab-gitops',
    slug: 'gitlab-homelab-gitops',
    description: 'Konfigurasi homelab dengan GitOps pattern menggunakan Flux dan ArgoCD.',
    repo_url: 'https://gitlab.com/suwardi87/homelab-gitops',
    live_url: 'https://labs.suwardi.dev',
    tech_stack: ['Kubernetes', 'Flux', 'ArgoCD', 'SOPS'],
    ai_summary: 'Cluster Kubernetes self-hosted dengan deklarasi penuh via GitOps. Semua secrets dienkripsi dengan SOPS + age.',
    is_featured: false,
    stars: 21,
    forks: 3,
    last_pushed_at: '2026-06-12T09:45:00Z',
    source: 'gitlab'
  }
]

export const mockMedia: MediaItem[] = [
  {
    id: 1,
    platform: 'instagram',
    media_type: 'image',
    media_url: 'https://example.com/media/1',
    thumbnail_url: '',
    caption: 'Behind the scenes: building our new dashboard infrastructure',
    posted_at: '2026-06-20T10:00:00Z',
    likes: 234,
    comments: 12
  },
  {
    id: 2,
    platform: 'tiktok',
    media_type: 'video',
    media_url: 'https://example.com/media/2',
    thumbnail_url: '',
    caption: '3 tips debugging Rust yang memuakkan',
    posted_at: '2026-06-18T15:30:00Z',
    likes: 1200,
    comments: 45
  }
]

export const activityLog = [
  { type: 'sync', text: 'Sinkronisasi 6 repositori dari GitHub', time: '2 jam lalu' },
  { type: 'feature', text: 'realtime-dashboard ditandai sebagai proyek unggulan', time: '5 jam lalu' },
  { type: 'ai', text: 'AI meringkas 3 README repositori', time: '1 hari lalu' },
  { type: 'cv', text: 'CV versi 2.3 di-generate', time: '3 hari lalu' }
]
