"use client";
import Link from 'next/link';
import { useStore } from '@/app/store';
import LoggedInUserMenu from '@/app/components/layout/LoggedInUserMenu';
import SettingsMenu from '@/app/components/layout/SettingsMenu';
import {
    Home as HomeIcon,
    User as UserIcon,
    Palette as ArtistsIcon,
    Search as BrowseIcon,
    UserCircle as ProfileIcon,
    LucideIcon, // Import the LucideIcon type
} from 'lucide-react';

// Define a type for the navigation links
type NavLink = {
    href: string;
    label: string;
    icon: LucideIcon; // Use LucideIcon type for icons
};

// Array of navigation links
const navLinks: NavLink[] = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/artists", label: "Artists", icon: ArtistsIcon },
    { href: "/browse", label: "Browse", icon: BrowseIcon },
    { href: "/profile", label: "Profile", icon: ProfileIcon },
];

export default function Navbar() {
    const { isLoginModalOpen, openLoginModal, closeLoginModal, isAuthenticated } = useStore();

    // Function to render the Login/Logout button
    const renderAuthButton = () => {
        if (isAuthenticated) {
            return <LoggedInUserMenu />;
        }
        return (
            <button
                onClick={isLoginModalOpen ? closeLoginModal : openLoginModal}
                className="nav-link hover:text-white transition-colors duration-300 flex items-center"
            >
                <UserIcon className="h-5 w-5 mr-1" />
                {isLoginModalOpen ? "Close" : "Login"}
            </button>
        );
    };

    return (
        <nav className="sticky top-0 z-50 py-4 bg-vapor-dark bg-opacity-90 text-vapor-light font-scan shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-widest neon-highlight flex items-center">
                    <HomeIcon className="h-6 w-6 mr-2" />
                    Prism
                </Link>
                <ul className="flex items-center space-x-6 uppercase tracking-widest text-sm">
                    {/* Map over the navLinks array to render each link */}
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <li key={href}>
                            <Link href={href} className="nav-link group flex items-center hover:text-white transition-colors duration-300">
                                <Icon className="h-5 w-5 mr-1" />
                                {label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        {renderAuthButton()}
                    </li>
                    {isAuthenticated && (
                        <li>
                            <SettingsMenu />
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}