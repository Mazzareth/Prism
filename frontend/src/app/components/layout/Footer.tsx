// src/components/layout/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-neutral text-base-100 p-4 mt-8 text-center">
      <p>© {new Date().getFullYear()} Art Platform. All rights reserved.</p>
    </footer>
  );
}