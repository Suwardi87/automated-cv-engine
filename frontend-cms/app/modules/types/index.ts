export interface User {
  id: number
  name: string
  email: string
  bio: string | null
  avatar_url: string | null
  username?: string | null
  created_at: string
}

export interface Repo {
  id: number
  title: string
  slug: string
  tech_stack: string[]
  ai_summary: string | null
  repo_url: string
  live_url: string | null
  is_featured: boolean
  last_pushed_at: string
}

export interface CvData {
  profil: string
  technicalSkills: string[]
  softSkills: string[]
  experiences: {
    role: string
    company: string
    period: string
    bullets: string[]
  }[]
  education: {
    degree: string
    school: string
    period: string
    note: string
  }[]
  organizations: {
    role: string
    company: string
    period: string
    bullets: string[]
  }[]
  certificates: string[]
  portfolioLinks: string
}
