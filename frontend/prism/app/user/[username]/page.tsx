// app/[username]/page.tsx
"use client";
import { useStore } from "@/app/store";
import { PublicUser, User } from "@/app/services/api/models";
import { UserApi } from "@/app/services/api";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface UserProfileProps {
  isOwnProfile: boolean;
  profileData: PublicUser;
  loggedInUserData?: User | null;
  isLoggedIn: boolean;
}

async function getUserProfileData(
  username: string
): Promise<PublicUser | null> {
  try {
    const api = new UserApi();
    const response = await api.usersRead(username);
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      status?: number;
      response?: { data?: { detail?: string } };
    };

    if (err.status === 404 || err.response?.data?.detail === "Not found.") {
      console.error("User not found:", err);
      return null;
    }

    console.error("Error fetching user data:", err);
    return null;
  }
}

const ProfilePicture: React.FC<{ profileData: PublicUser }> = ({
  profileData,
}) => {
  const imageUrl = profileData.profile_picture || "/default.jpg"; // Fallback image
  return (
    <div className="relative w-32 h-32">
      <Image
        src={imageUrl}
        alt={`${profileData.username}'s profile`}
        className="rounded-full shadow-lg object-cover"
        width={128}
        height={128}
      />
      <div className="absolute inset-0 rounded-full border-4 border-vapor-pink animate-glow"></div>
    </div>
  );
};

const ProfileHeader: React.FC<{ username: string }> = ({ username }) => {
  return (
    <div className="mb-6 text-center">
      <h1 className="font-scan text-4xl md:text-5xl font-bold text-vapor-pink tracking-wider mb-2">
        {username}
      </h1>
      <div className="border-b-2 border-vapor-blue inline-block w-24"></div>
    </div>
  );
};

const ContentItem: React.FC<{
  title: string;
  value: string | null | undefined;
  link?: string;
}> = ({ title, value, link }) => {
  const content = value || <span className="text-gray-500">Not specified</span>;

  return (
    <div className="content-item-placeholder group relative overflow-hidden">
      <h3 className="neon-highlight2 mb-1 font-digital text-sm">{title}</h3>
      {link ? (
        <Link href={link} className="block w-full h-full">
          <p className="text-vapor-blue group-hover:text-vapor-pink transition-colors duration-300">
            {content}
          </p>
        </Link>
      ) : (
        <p className="text-vapor-blue">{content}</p>
      )}
      <span className="absolute -bottom-full left-0 w-full h-1 bg-gradient-to-r from-transparent via-vapor-pink to-transparent group-hover:bottom-0 transition-all duration-500 ease-in-out"></span>
    </div>
  );
};

const OwnProfileInformation: React.FC<{ profileData: User }> = ({
  profileData,
}) => {
  return (
    <div className="mb-8">
      <div className="space-y-4">
        <ContentItem title="Email" value={profileData.email} />
        <ContentItem title="Bio" value={profileData.bio} />
      </div>
      <Link
        href="/settings/profile"
        className="vaporwave-button mt-6 inline-block"
      >
        Edit Profile
      </Link>
    </div>
  );
};

const OtherUserProfileInformation: React.FC<{
  profileData: PublicUser;
  isLoggedIn: boolean;
}> = ({ profileData, isLoggedIn }) => {
  return (
    <div>
      {isLoggedIn && (
        <button className="vaporwave-button mb-6">
          {/* Placeholder for follow/unfollow logic */}
          Follow / Unfollow
        </button>
      )}
      <div className="space-y-4">
        <ContentItem title="Bio" value={profileData.bio} />
      </div>
    </div>
  );
};

const UserProfileCard: React.FC<UserProfileProps> = ({
  isOwnProfile,
  profileData,
  isLoggedIn,
}) => {
  return (
    <div className="w-full max-w-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 rounded-2xl p-8 shadow-2xl z-50 flex flex-col items-center">
      <div className="flex flex-col items-center w-full mb-8">
        <ProfilePicture profileData={profileData} />
        <ProfileHeader username={profileData.username} />
      </div>
      <div className="w-full">
        {isOwnProfile ? (
          <OwnProfileInformation profileData={profileData} />
        ) : (
          <OtherUserProfileInformation
            profileData={profileData}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  );
};

const UserProfile: React.FC<UserProfileProps> = (props) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-vapor-dark bg-grid bg-size-grid">
      <UserProfileCard {...props} />
    </div>
  );
};

export default function UserProfilePage() {
  const loggedInUser = useStore((state) => state.user);
  const [profileData, setProfileData] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const params = useParams();
  const username = params.username as string;
  const isLoggedIn = !!loggedInUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      setIsLoading(true);
      const data = await getUserProfileData(username);
      setProfileData(data);
      setIsLoading(false);
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    if (loggedInUser && profileData) {
      setIsOwnProfile(loggedInUser.username === profileData.username);
    } else {
      setIsOwnProfile(false);
    }
  }, [loggedInUser, profileData, username]);

  if (isLoading || !profileData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-vapor-dark bg-grid bg-size-grid">
        <div className="vaporwave-button animate-glow">Loading...</div>
      </div>
    );
  }

  return (
    <UserProfile
      isOwnProfile={isOwnProfile}
      profileData={profileData}
      loggedInUserData={isOwnProfile ? loggedInUser : undefined}
      isLoggedIn={isLoggedIn}
    />
  );
}
