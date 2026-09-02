
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

export async function fetchRequestGeneral<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const response = await fetch(url, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let message = `Request gagal dengan status ${response.status}`
    try {
      const errorBody = await response.json()
      if (errorBody?.message) message = errorBody.message
    } catch {
      message = `Request gagal dengan status ${response.status}`
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null as T
  }

  return (await response.json()) as T
}
