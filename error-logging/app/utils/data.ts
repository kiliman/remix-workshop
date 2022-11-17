export type ErrorsType = { [key: string]: string }
export type ActionData<SuccessType> =
  | { errors: ErrorsType }
  | { success: SuccessType }

export function getErrors<T>(data: ActionData<T> | null) {
  if (data && 'errors' in data) {
    return data['errors'] as ErrorsType
  }
  return {} as ErrorsType
}
// export function getFields<T>(data: ActionData<unknown, T> | null) {
//   if (data && 'fields' in data) {
//     return data.fields as T
//   }
//   return {} as T
// }

export function getSuccess<T>(data: ActionData<T> | null) {
  if (data && 'success' in data) {
    return data.success as T
  }
  return {} as T
}
