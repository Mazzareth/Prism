// components/NavBar.tsx
"use client";

import Link from "next/link";
import { NavButton } from "@/app/types/navBar";
import React from "react";

interface NavBarProps {
  buttons: NavButton[];
}

const NavBar: React.FC<NavBarProps> = ({ buttons }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Prism
        </Link>
        <div className="space-x-4">
          {buttons.map((button, index) => (
            <React.Fragment key={index}>
              {button.href ? (
                <Link href={button.href}>
                  <button
                    className="hover-button"
                    onClick={button.onClick}
                  >
                    {button.label}
                  </button>
                </Link>
              ) : (
                <button
                  className="hover-button"
                  onClick={button.onClick}
                >
                  {button.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
