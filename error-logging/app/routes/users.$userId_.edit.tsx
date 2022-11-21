import { type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { z } from 'zod'
import { getUser, saveUser } from '~/models.server/user'
import { getField, getInvalid } from '~/utils/data'
import { getFormData, getParamsOrThrow } from '~/utils/params'
import { invalid, notFound } from '~/utils/responses'
import {
  redirect,
  typedjson,
  useTypedActionData,
  useTypedLoaderData,
} from '~/utils/typedjson'

export const loader = async ({ params }: LoaderArgs) => {
  const { userId } = getParamsOrThrow(params, z.object({ userId: z.number() }))
  const user = await getUser(userId)
  if (!user) {
    throw notFound('User not found')
  }
  return typedjson({ user })
}

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
})

export const action = async ({ request, params }: ActionArgs) => {
  const { userId } = getParamsOrThrow(params, z.object({ userId: z.number() }))
  const [errors, data, fields] = await getFormData(request, formSchema)
  if (errors) {
    return invalid({ errors, fields })
  }
  const { name, email, age } = data
  await saveUser(userId, { name, email, age })

  return redirect('/users/')
}

export default function Index() {
  const { user } = useTypedLoaderData<typeof loader>()
  const data = useTypedActionData<typeof action>()
  const [errors, fields] = getInvalid(data)

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
