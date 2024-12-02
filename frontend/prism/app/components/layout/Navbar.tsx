import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 p-4 bg-vapor-dark bg-opacity-90 text-vapor-light font-scan shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-widest neon-highlight">
          Prism
        </Link>
        <ul className="flex space-x-6 uppercase tracking-widest text-sm">
          <li>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link href="/artists" className="nav-link">
              Artists
            </Link>
          </li>
          <li>
            <Link href="/browse" className="nav-link">
              Browse
            </Link>
          </li>
          <li>
            <Link href="/profile" className="nav-link">
              Profile
            </Link>
          </li>
          <li>
            <Link href="/login" className="nav-link">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}