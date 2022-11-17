import { type ActionData, type ErrorsType } from '~/utils/data'
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

type FieldsType = { [key: string]: string }
export function invalid(
  data: { errors: ErrorsType; fields: FieldsType },
  init?: number | ResponseInit,
) {
  return typedjson({ errors } as ActionData<unknown>, init ?? { status: 400 })
}

// export function invalid<FieldsType>(
//   errors: ErrorsType,
//   fields?: FieldsType,
//   init?: number | ResponseInit,
// ) {
//   return json(
//     { errors, fields } as ActionData<unknown, FieldsType>,
//     init ?? { status: 400 },
//   )
// }

export function success<SuccessType>(
  data: SuccessType,
  init?: number | ResponseInit,
) {
  return typedjson(
    { success: data } as ActionData<SuccessType>,
    init ?? { status: 200 },
  )
}
