// src/pages/artists.tsx
import React from 'react';
import ArtistCard from '@/app/components/artist/ArtistCard';

interface Artist {
    id: number;
    name: string;
    role: string;
    profileImage?: string;
}

const artistsData: Artist[] = [
    {
        id: 1,
        name: "Artist 1",
        role: "Verified Artist",
        profileImage: "/artist1.jpg",
    },
    {
        id: 2,
        name: "Artist 2",
        role: "Artist",
        profileImage: "/artist2.jpg",
    },
    {
        id: 3,
        name: "Artist 3",
        role: "Moderator",
        profileImage: "/artist3.jpg",
    },
];

export default function ArtistsPage() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Meet Our Artists</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artistsData.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                ))}
            </div>
        </>
    );
}