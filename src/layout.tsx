import { Link, Outlet } from "react-router"

function Navbar() {
  return (
    <nav className="px-6 py-4">
      <Link to="/" className="font-display text-xl font-semibold">
        Open Studio
      </Link>
    </nav>
  )
}

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
