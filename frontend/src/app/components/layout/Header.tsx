"use client";
import React, { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Transition, Listbox } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  HomeIcon,
  PhotoIcon,
  PencilSquareIcon,
  UsersIcon,
  Cog8ToothIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface Theme {
    name: string;
    value: 'Day' | 'Dusk' | 'Night'; // Restrict the type here
}

const themes: Theme[] = [
  { name: 'Day', value: 'Day' },
  { name: 'Dusk', value: 'Dusk' },
  { name: 'Night', value: 'Night' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            const theme = themes.find((t) => t.value === storedTheme);
            if (theme) {
                setSelectedTheme(theme);
                document.body.classList.remove('day-mode', 'dusk-mode', 'night-mode');
                document.body.classList.add(`${theme.value.toLowerCase()}-mode`);

            }
        } else {
            // Set initial theme class if nothing stored in localStorage.
             document.body.classList.add("day-mode");
        }
    }, []);

  const changeTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('theme', theme.value);

    document.body.classList.remove('day-mode', 'dusk-mode', 'night-mode');
    document.body.classList.add(`${theme.value.toLowerCase()}-mode`);
  };

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
            <span className="text-3xl font-extrabold tracking-tight">
              Prism
            </span>
          </Link>

          {/* Desktop Navigation, Auth, and Settings */}
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

            <Listbox value={selectedTheme} onChange={changeTheme}>
              <div className="relative">
                <Listbox.Button className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Change Theme</span>
                  <Cog8ToothIcon className="w-6 h-6 text-white hover:text-yellow-300" />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    {themes.map((theme) => (
                      <Listbox.Option
                        key={theme.value}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-yellow-100 text-gray-900' : 'text-gray-900'
                          }`
                        }
                        value={theme}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {theme.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Menu as="div" className="relative inline-block text-left">
              {/* ... (Menu.Button is the same) */}
              <Transition
                as={Fragment}
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
                            {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                            {item.label}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                     <Menu.Item>
                    <Listbox value={selectedTheme} onChange={changeTheme}>
                        <div className="relative">
                        <Listbox.Button className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full text-left">
                            <span className="sr-only">Change Theme</span>
                            <span className="flex items-center">
                            <Cog8ToothIcon className="w-5 h-5 mr-2 text-gray-900" />
                            <span>
                                {selectedTheme.name}
                            </span>
                            </span>
                        </Listbox.Button>
                        <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            {themes.map((theme) => (
                            <Listbox.Option
                                key={theme.value}
                                className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-yellow-100 text-gray-900' : 'text-gray-900'
                                }`
                                }
                                value={theme}
                            >
                                {({ selected }) => (
                                <>
                                    <span
                                    className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                    }`}
                                    >
                                    {theme.name}
                                    </span>
                                    {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    ) : null}
                                </>
                                )}
                            </Listbox.Option>
                            ))}
                        </Listbox.Options>
                        </Transition>
                    </div>
                    </Listbox>
                  </Menu.Item>
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