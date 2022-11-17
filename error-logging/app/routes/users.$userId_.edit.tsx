import { type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { z } from 'zod'
import { getUser } from '~/models/user.server'
import { getFormData, getParamsOrThrow } from '~/utils/params'
import {
  typedjson,
  useTypedActionData,
  useTypedLoaderData,
} from '~/utils/typedjson'

export const loader = async ({ params }: LoaderArgs) => {
  const { userId } = getParamsOrThrow(params, z.object({ userId: z.number() }))
  const user = await getUser(userId)
  return typedjson({ user })
}

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
})

function invalid<T>(data: T) {
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

export const action = async ({ request, params }: ActionArgs) => {
  getParamsOrThrow(params, z.object({ userId: z.number() }))
  const [errors, data, fields] = await getFormData(request, formSchema)
  if (errors) {
    return invalid({ errors, fields })
  }
  return typedjson({
    success: { message: 'successfully saved user' },
  })
}

export type ErrorsType = { [key: string]: string }
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

export default function Index() {
  const { user } = useTypedLoaderData<typeof loader>()
  console.log(user.birthday.toLocaleDateString())
  const data = useTypedActionData<typeof action>()
  const [errors, fields] = getInvalid(data)
  const { message } = getSuccess(data)

  return (
    <Form method="post" className="m-4">
      <div className="flex flex-col gap-4 items-start">
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={getField(user, fields, 'name')}
            className="mt-1 border rounded px-2 py-1"
          />
          {errors.name && <p className="text-red-700">{errors.name}</p>}
        </div>
        <div>
          <label className="block">Email</label>
          <input
            type="text"
            name="email"
            defaultValue={getField(user, fields, 'email')}
            className="mt-1 border rounded px-2 py-1"
          />
          {errors.email && <p className="text-red-700">{errors.email}</p>}
        </div>
        <div>
          <label className="block">Age</label>
          <input
            type="text"
            name="age"
            defaultValue={getField(user, fields, 'age')}
            className="mt-1 border rounded px-2 py-1"
          />
          {errors.age && <p className="text-red-700">{errors.age}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded shadow-md px-2 py-1"
        >
          Submit
        </button>
        {message && <p className="text-green-700">{message}</p>}
      </div>
    </Form>
  )
}

export function CatchBoundary() {
  return (
    <div className="text-red-700">
      <h1>Something went wrong</h1>
    </div>
  )
}
