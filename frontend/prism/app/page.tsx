'use client'
import React, { useEffect, useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const trailElement = document.createElement('div');
      trailElement.classList.add('mouse-trail');
      // Set custom properties for initial position
      trailElement.style.setProperty('--mouse-x', `${event.clientX}px`);
      trailElement.style.setProperty('--mouse-y', `${event.clientY}px`);
      trailElement.style.top = `${event.clientY}px`;
      trailElement.style.left = `${event.clientX}px`;

      containerRef.current.appendChild(trailElement);

       // Apply falling animation
       trailElement.style.animation = 'trailFall 1.2s linear forwards';

      trailElement.addEventListener('animationend', () => {
        trailElement.remove();
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center justify-center min-h-screen pt-16 pb-24">
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }} />
      <main className="container mx-auto p-8 md:p-16 text-center z-10">
          <div className="neon-highlight">
            <h1 className="title-vaporwave font-scan mb-4 text-4xl md:text-6xl" data-text="Welcome to Prism">
              Welcome to Prism
            </h1>
          </div>
        <p className="subtitle-vaporwave font-digital text-lg md:text-2xl mt-4 neon-highlight" data-text="Discover and showcase stunning digital art.">
          Discover and showcase stunning digital art.
        </p>
      </main>
    </div>
  );
}