const env = import.meta.env

interface FetchOptions extends RequestInit {
  isAuth?: boolean
}

const fetchRequest = async (url: string, options: FetchOptions = { isAuth: false }) => {
  const headers = new Headers(options.headers || {})

  const finalOptions: RequestInit = {
    ...options,
    headers,
  }

  try {
    return await fetch((env.VITE_API_URL ?? '') + url, finalOptions)
  } catch (error) {
    throw error instanceof Error ? error : new Error('Terjadi kesalahan jaringan')
  }
}

export default fetchRequest