// src/components/artist/ArtistCard.tsx
import React from 'react';
import Image from 'next/image';

interface Artist {
  id: number;
  name: string;
  role: string;
  profileImage?: string;
}

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <Image
        src={artist.profileImage || '/placeholder-image.jpg'}
        alt={`${artist.name}'s profile`}
        width={300}
        height={200}
        layout="responsive"
        objectFit="cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{artist.name}</h3>
        <p className="text-sm text-neutral-600">{artist.role}</p>
      </div>
    </div>
  );
}