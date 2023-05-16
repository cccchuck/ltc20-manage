export type ClientResponse<T> = {
  success: boolean
  data?: ServerResponse<T> | T | null
  error?: unknown | null
}

export type ServerResponse<T> = {
  code: number
  message: string
  data: T
}
