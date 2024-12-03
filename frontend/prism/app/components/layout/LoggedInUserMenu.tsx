import { Menu, Transition } from "@headlessui/react";
import { Fragment, FC } from "react";
import { useStore } from "@/app/store";
import Link from "next/link";

interface MenuItemProps {
  active?: boolean;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ children, onClick, href }) => {
  const content = (
    <>
      {children}
      <span className="absolute inset-0 bg-gradient-to-r from-sky-500/50 via-pink-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </>
  );

  return (
    <Menu.Item>
      {({ active: isMenuItemActive }) =>
        href ? (
          <Link href={href} passHref>
            <div
              className={`vaporwave-menu-item group ${
                isMenuItemActive ? "bg-gray-700" : ""
              }`}
            >
              {content}
            </div>
          </Link>
        ) : (
          <button
            onClick={onClick}
            className={`vaporwave-menu-item group ${
              isMenuItemActive ? "bg-gray-700" : ""
            }`}
          >
            {content}
          </button>
        )
      }
    </Menu.Item>
  );
};

const LoggedInUserMenu: FC = () => {
  const { user, logout } = useStore();

  if (!user) {
    return null;
  }

  const profileLink = `/user/${user.username}`;

  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button className="nav-link group flex items-center">
        <span className="neon-highlight2">{user.username}</span>
        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-sky-500 to-pink-500 transition-all duration-500 group-hover:w-full" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-600 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <MenuItem href={profileLink}>My Profile</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LoggedInUserMenu;
