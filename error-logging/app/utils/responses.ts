import { type ActionData } from '~/utils/data'
import { typedjson } from './typedjson'

export function notFound(message?: string) {
  return new Response(message ?? 'Not Found', { status: 404 })
}

export function badRequest(message?: string) {
  return new Response(message ?? 'Bad Request', { status: 400 })
}

export function unauthorized(message?: string) {
  return new Response(message ?? 'Unauthorized', { status: 401 })
}

export function forbidden(message?: string) {
  return new Response(message ?? 'Unauthorized', { status: 403 })
}

export function invalid<T>(data: T) {
  return typedjson(data, { status: 400 })
}
export function success<SuccessType>(
  data: SuccessType,
  init?: number | ResponseInit,
) {
  return typedjson(
    { success: data } as ActionData<SuccessType, unknown>,
    init ?? { status: 200 },
  )
}
