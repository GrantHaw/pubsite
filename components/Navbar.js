import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-brand dark:bg-brand-dark shadow">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Grant Hawerlander</h1>
        <ul className="flex space-x-8">
          <li>
            <Link href="/" className="text-gray-200 hover:text-white">
              Home
            </Link>
          </li>
          <li>
            <Link href="/projects" className="text-gray-200 hover:text-white">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-200 hover:text-white">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
