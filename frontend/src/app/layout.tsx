// src/app/layout.tsx
"use client"; // Add use client here
import '@/app/styles/globals.css';
import Header from './components/layout/Header';
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentTheme, setCurrentTheme] = useState<'Day' | 'Dusk' | 'Night'>('Day');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'Day' | 'Dusk' | 'Night' | null;
    if (storedTheme) {
      setCurrentTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    document.body.classList.remove('day-mode', 'dusk-mode', 'night-mode');
    document.body.classList.add(`${currentTheme.toLowerCase()}-mode`);
  }, [currentTheme]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}