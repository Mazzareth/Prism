// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from '@/app/components/NavBar';
import getNavButtons from './config/navConfig';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const navButtons = await getNavButtons();
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar buttons={navButtons} />
        {children}
      </body>
    </html>
  );
}