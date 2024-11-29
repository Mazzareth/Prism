// src/app/components/layout/Header.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  HomeIcon,
  PhotoIcon,
  PencilSquareIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>; // Make icon optional
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/artists', label: 'Artists', icon: UserCircleIcon },
    { href: '/gallery', label: 'Gallery', icon: PhotoIcon },
    { href: '/commissions', label: 'Commissions', icon: PencilSquareIcon },
    { href: '/community', label: 'Community', icon: UsersIcon },
  ];

  const authItems: NavItem[] = [
    { href: '/login', label: 'Login' },
    { href: '/signup', label: 'Sign Up' },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-800 via-purple-600 to-pink-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="ArtHaven Logo" width={40} height={40} />
            <span className="text-3xl font-extrabold tracking-tight">
              Prism
            </span>
          </Link>

          {/* Desktop Navigation and Auth */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 text-lg hover:text-yellow-300 transition duration-300 ease-in-out"
                >
                   {item.icon && <item.icon className="h-6 w-6" />}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 px-4 py-2 rounded-md transition duration-300 ease-in-out"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button
                  className="text-white hover:text-yellow-300 focus:outline-none focus:text-yellow-300"
                  aria-label="Toggle mobile menu"
                >
                  <Bars3Icon className="h-7 w-7" />
                </Menu.Button>
              </div>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {navItems.concat(authItems).map((item) => (
                      <Menu.Item key={item.href}>
                        {({ active }) => (
                          <Link
                            href={item.href}
                           onClick={() => setIsMobileMenuOpen(false)}
                            className={`${
                              active ? 'bg-yellow-300 text-gray-800' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                             {item.icon &&  <item.icon className="mr-2 h-5 w-5" />}
                            {item.label}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}