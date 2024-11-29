// src/app/components/layout/Header.tsx
import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-yellow-400">
          Art Platform
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/artists" className="hover:text-yellow-400 transition-colors">
                Artists
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-yellow-400 transition-colors">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/commissions" className="hover:text-yellow-400 transition-colors">
                Commissions
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-yellow-400 transition-colors">
                Community
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-yellow-400 transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-yellow-400 transition-colors">
                Sign up
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}