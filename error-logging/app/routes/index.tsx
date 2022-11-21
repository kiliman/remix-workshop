import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <div>
      <Link className="text-white bg-red-500 px-2 py-1 rounded" to="/error">
        Throw Error
      </Link>
    </div>
  )
}
