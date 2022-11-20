import { json, type ActionArgs } from '@remix-run/node'
import { Form, useActionData, useTransition } from '@remix-run/react'
import { addTenant, getTenantById } from '~/models/tenant.server'
import { provisionTenant } from '~/services/tenant.server'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const name = String(formData.get('name'))
  const host = String(formData.get('host'))

  let tenant = await getTenantById(host)
  if (tenant) {
    return json({ errors: { host: 'Host already exists' } }, { status: 400 })
  }

  tenant = await addTenant(name, host)
  provisionTenant(host)

  return json({ tenant })
}

export default function Index() {
  const { tenant, errors } = useActionData() ?? {}
  const transition = useTransition()

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <h1 className="text-2xl font-semibold">Tenant Onboarding</h1>
        <Form method="post" className="mt-4 space-y-6" noValidate>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Tenant Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                required
                autoFocus={true}
                name="name"
                type="text"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="host"
              className="block text-sm font-medium text-gray-700"
            >
              Tenant Host
            </label>
            <div className="mt-1">
              <input
                id="host"
                required
                autoFocus={true}
                name="host"
                type="text"
                className="rounded border border-gray-500 px-2 py-1 text-lg"
              />{' '}
              .remix.local
            </div>
            {errors?.host && <p className="text-red-700">{errors?.host}</p>}
          </div>
          <button
            type="submit"
            disabled={transition.state !== 'idle'}
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Add Tenant
          </button>
        </Form>
        {transition.state !== 'idle' && (
          <p className="text-blue-700">Provisioning tenant... one moment</p>
        )}
        {tenant && (
          <>
            <p className="text-green-700">
              {tenant.name} successfully created!
            </p>
            <a href={`http://${tenant.host}.remix.local:3000/login`}>
              Login to tenant
            </a>
          </>
        )}
      </div>
    </div>
  )
}
