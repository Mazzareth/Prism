import React from 'react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-indigo-800 p-12">
      <div className="rounded-lg bg-gray-900 bg-opacity-70 p-10 shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-white mb-4 font-mono tracking-wide">
          Welcome to Prism
        </h1>
        <p className="text-lg text-gray-300 mb-6 font-mono">
          Explore the shimmering landscape of data.
        </p>
        <button className="hover-button">
          Get Started
        </button>
      </div>
    </main>
  );
}