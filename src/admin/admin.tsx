import { Link, Outlet } from "react-router"

export default function Admin() {
  return (
    <main className="font-body mx-auto max-w-3xl px-6 pb-12">
      <nav className="mb-8 flex gap-4 border-b border-neutral-200 pb-4">
        <Link to="/admin" className="text-sm font-medium hover:underline">
          Projects
        </Link>
        <Link
          to="/admin/authors"
          className="text-sm font-medium hover:underline"
        >
          Authors
        </Link>
      </nav>
      <Outlet />
    </main>
  )
}
