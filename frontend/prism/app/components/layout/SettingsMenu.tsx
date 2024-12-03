// app/components/SettingsMenu.tsx
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useCallback, useEffect } from "react";
import { SlidersHorizontal as SettingsIcon } from "lucide-react";
import { ToggleLeft, ToggleRight } from "lucide-react";

// Define a type for the settings
type Setting = {
  id: string; // Changed index to id for better identification and keying
  label: string;
  state: boolean;
  toggle: () => void;
};

export default function SettingsMenu() {
    const [settings, setSettings] = useState<Setting[]>([
        { id: "setting-1", label: "Test Setting 1", state: false, toggle: () => {} },
        { id: "setting-2", label: "Test Setting 2", state: true, toggle: () => {} },
        { id: "setting-3", label: "Test Setting 3", state: false, toggle: () => {} },
    ]);
    
    useEffect(() => {
        setSettings((prevSettings) =>
          prevSettings.map((setting) => ({
              ...setting,
              toggle: () => toggleSetting(setting.id),
          }))
        );
    }, []);
    

    const toggleSetting = useCallback((id: string) => {
        setSettings((prevSettings) =>
          prevSettings.map((setting) =>
            setting.id === id
              ? { ...setting, state: !setting.state }
              : setting
          )
        );
    }, []);

  return (
    <Menu as="div" className="relative inline-block ml-4">
      <Menu.Button className="nav-link group flex items-center">
        <SettingsIcon className="h-5 w-5" />
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
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-600 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {settings.map((setting) => (
              <Menu.Item key={setting.id}>
                {({ active }) => (
                  <div
                    onClick={setting.toggle}
                    className={`vaporwave-menu-item group flex items-center justify-between px-4 py-2 ${
                      active ? "bg-gray-700" : ""
                    }`}
                  >
                    <span>{setting.label}</span>
                    <div
                      className={`relative cursor-pointer w-6 h-6 rounded-full transition-colors duration-300 ${
                        "bg-gray-400"
                      }`}
                    >
                      {setting.state ? (
                        <ToggleRight className="absolute inset-0 h-full w-full text-white" />
                      ) : (
                        <ToggleLeft className="absolute inset-0 h-full w-full text-gray-700" />
                      )}
                    </div>
                    <span className="absolute inset-0 bg-gradient-to-r from-sky-500/50 via-pink-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}