import { Link } from '@remix-run/react'
import { getUsers } from '~/models.server/user'
import { typedjson, useTypedLoaderData } from '~/utils/typedjson'

export const loader = async () => {
  const users = getUsers()
  return typedjson({ users })
}

export default function UsersList() {
  const { users } = useTypedLoaderData<typeof loader>()
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold">Users</h1>
      <ul className="mt-4">
        {users.map(user => (
          <li
            key={user.id}
            className="p-4 border rounded mb-4 hover:bg-blue-100"
          >
            <Link to={`${user.id}/edit`}>
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div>Age: {user.age}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
