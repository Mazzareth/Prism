// src/app/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Placeholder data for featured artists and trending art - replace with API calls later
const featuredArtists = [
    {
      id: 1,
      name: 'Aurora Borealis',
      username: 'aurora_b',
      profileImage: '/images/placeholder-profile.jpg', // Path to the image in public folder
    },
    {
      id: 2,
      name: 'Nebula Dreams',
      username: 'nebula_d',
      profileImage: '/images/placeholder-profile2.png', // Path to the image in public folder
    },
    {
        id: 3,
        name: 'Stardust Serenade',
        username: 'stardust_s',
        profileImage: '/images/placeholder-profile3.png', // Path to the image in public folder
      },
  ];
  

  const trendingArt = [
    {
      id: 1,
      title: 'Whispers of the Wild',
      artist: 'Aurora Borealis',
      imageUrl: '/images/placeholder-image.jpg', // Path to the image in public folder
      type: 'image',
    },
    {
      id: 2,
      title: 'Celestial Symphony',
      artist: 'Nebula Dreams',
      imageUrl: '/images/placeholder-image2.jpg', // Path to the image in public folder
      type: 'image',
    },
    {
      id: 3,
      title: 'Echoes of the Cosmos',
      artist: 'Stardust Serenade',
      imageUrl: '/images/placeholder-image3.jpg', // Path to the image in public folder
        type: 'image',
    },
      {
        id: 4,
      title: 'Lyrical Starlight',
      artist: 'Aurora Borealis',
        imageUrl: '/images/placeholder-audio.jpg', // Path to the image in public folder
        type: 'audio'
      }
  ];

export default function HomePage() {
    const [currentTheme, setCurrentTheme] = useState<'Day' | 'Dusk' | 'Night'>('Day');
  
    useEffect(() => {
      const storedTheme = localStorage.getItem('theme') as 'Day' | 'Dusk' | 'Night' | null;
      if (storedTheme) {
        setCurrentTheme(storedTheme);
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('theme', currentTheme);
       // Apply theme-specific classes to the body element
       document.body.classList.remove('day-mode', 'dusk-mode', 'night-mode');
       document.body.classList.add(`${currentTheme.toLowerCase()}-mode`);
     }, [currentTheme]);
     const themeColors = {
        Day: {
          background: 'bg-white',
          text: 'text-gray-800',
        },
        Dusk: {
          background: 'bg-gradient-to-r from-indigo-800 via-purple-600 to-pink-500',
          text: 'text-white',
        },
        Night: {
          background: 'bg-gray-900',
          text: 'text-gray-100',
        },
      };
  

  return (
      <main className={`${themeColors[currentTheme].background} ${themeColors[currentTheme].text} min-h-screen`}>
          {/* Hero Section */}
          <section className="relative py-24 md:py-32 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
              <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Dark overlay */}
              <div className="container mx-auto px-4 relative z-10 text-center">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">Discover and Support Incredible Artists</h1>
                  <p className="text-lg md:text-xl text-white mb-8">
                      Prism is a vibrant community where artists share their unique creations and connect with patrons like you.
                  </p>
                  <Link href="/signup" className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out">
                      Join Prism Today
                  </Link>
              </div>
          </section>

          {/* Featured Artists Section */}
          <section className="container mx-auto px-4 py-12">
              <h2 className="text-3xl font-bold mb-8">Featured Artists</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {featuredArtists.map((artist) => (
                      <Link key={artist.id} href={`/artists/${artist.username}`}>
                          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                               <div className="relative h-48 w-full">
                                    <Image
                                        src={artist.profileImage}
                                        alt={`${artist.name}'s profile`}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                              </div>
                              <div className="p-4">
                                  <h3 className="font-semibold text-lg">{artist.name}</h3>
                                  <p className="text-gray-600">@{artist.username}</p>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Link href="/artists"
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out"
                  >
                    <span>Explore More Artists</span>
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </Link>
              </div>
          </section>

          {/* Trending Art Section */}
          <section className="container mx-auto px-4 py-12 bg-gray-100">
              <h2 className="text-3xl font-bold mb-8">Trending Art</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {trendingArt.map((art) => (
                      <Link key={art.id} href={`/art/${art.id}`}>
                          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                              <div className="relative h-48 w-full">
                                    <Image
                                        src={art.imageUrl}
                                        alt={art.title}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                    {art.type === 'audio' && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-12 h-12">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.563c0 1.031-.376 2.053-1.093 2.817l-5.25 5.25a6.562 6.562 0 01-9.313-9.313l5.25-5.25c.764-.717 1.786-1.093 2.817-1.093H9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 0160" />
                                            </svg>
                                        </div>
                                    )}
                              </div>

                              <div className="p-4">
                                  <h3 className="font-semibold text-lg">{art.title}</h3>
                                  <p className="text-gray-600">By {art.artist}</p>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
               <div className="mt-8 flex justify-center">
                <Link href="/gallery"
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out"
                  >
                    <span>Explore More Art</span>
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </Link>
              </div>
          </section>
            {/* Theme Selection Section */}
          <section className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-4">Theme Selection</h2>
                <p className="mb-8">Select your preferred viewing experience:</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentTheme('Day')}
                    className={`px-4 py-2 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring focus:border-blue-300 ${
                      currentTheme === 'Day'
                        ? 'bg-yellow-400 text-gray-800'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Day Mode
                  </button>
                  <button
                    onClick={() => setCurrentTheme('Dusk')}
                    className={`px-4 py-2 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring focus:border-blue-300 ${
                      currentTheme === 'Dusk'
                        ?  'bg-gradient-to-r from-indigo-800 via-purple-600 to-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    >
                    Dusk Mode
                  </button>
                  <button
                    onClick={() => setCurrentTheme('Night')}
                    className={`px-4 py-2 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring focus:border-blue-300 ${
                      currentTheme === 'Night'
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Night Mode
                  </button>
                </div>
            </section>
      </main>
  );
}