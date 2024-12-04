// app/config/navConfig.ts
import { NavButton } from "../types/navBar";
import { auth as firebaseAuth } from "@/app/utils/firebaseConfig";

const getNavButtons = async (): Promise<NavButton[]> => {
  const user = firebaseAuth.currentUser;

  const baseButtons: NavButton[] = [{ label: "Home", href: "/" }];

  if (user) {
    baseButtons.push({
      label: "Sign Out",
      href: "/auth/signout",
      onClick: () => {
        firebaseAuth
          .signOut()
          .then(() => {
            console.log("User signed out");
            window.location.href = "/";
          })
          .catch((error) => {
            console.error("Sign out error: ", error);
          });
      },
    });
  } else {
    baseButtons.push({
      label: "Sign In",
      href: "/auth/signin",
    });
  }

  return baseButtons;
};

export default getNavButtons;
