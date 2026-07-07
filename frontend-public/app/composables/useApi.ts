interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

export function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token', { sameSite: 'lax' })
  const apiBase = process.server
    ? (config.apiBaseSsr as string)
    : (config.public.apiBase as string)

  async function request<T>(url: string, opts: FetchOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...opts.headers,
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    try {
      return await $fetch<T>(`${apiBase}${url}`, { ...opts, headers })
    } catch (error: any) {
      if (error?.statusCode === 401 || error?.response?.status === 401) {
        const authToken = useCookie('auth_token')
        authToken.value = null
        if (import.meta.client) {
          navigateTo('/cms/login')
        }
      }
      throw error
    }
  }

  return {
    get<T>(url: string) {
      return request<T>(url)
    },
    post<T>(url: string, body?: any) {
      return request<T>(url, { method: 'POST', body })
    },
    apiBase,
  }
}
