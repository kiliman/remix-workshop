export type ErrorsType = { [key: string]: string }
export type FieldsType = { [key: string]: string }

export type ActionData<SuccessType, FieldsType> =
  | { errors: ErrorsType; fields: FieldsType }
  | { success: SuccessType }

export function getInvalid<FieldsType>(
  data: ActionData<unknown, FieldsType> | null,
) {
  return [getErrors(data), getFields(data)]
}

export function getErrors<FieldsType>(
  data: ActionData<unknown, FieldsType> | null,
) {
  if (data && 'errors' in data) {
    return data['errors'] as ErrorsType
  }
  return {} as ErrorsType
}
export function getFields<FieldsType>(
  data: ActionData<unknown, FieldsType> | null,
) {
  if (data && 'fields' in data) {
    return data['fields'] as FieldsType
  }
  return {} as FieldsType
}

export function getSuccess<SuccessType>(
  data: ActionData<SuccessType, unknown> | null,
) {
  if (data && 'success' in data) {
    return data['success'] as SuccessType
  }
  return {} as SuccessType
}

export function getField<T>(
  data: T,
  fields: { [key: string]: string },
  name: keyof T,
) {
  return (fields[name as string] as string) ?? data[name]
}
