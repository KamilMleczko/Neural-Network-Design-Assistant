"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@nndm/ui/navigation-menu";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6"; //we react-icons only because Lucide doesn't have X (Twitter) icon
import { useAuth } from "@/src/providers/auth-provider";
import { ThemeSwitcher } from "./theme-switcher";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="sticky top-0 z-50 flex justify-between border-b bg-background">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] grid-cols-2 gap-2 p-2">
                {/* Featured large link */}
                <li className="row-span-3">
                  <NavigationMenuLink href="#" className="flex h-full flex-col gap-2 space-y-5">
                    <div className="font-medium text-lg">AI-Powered Insights</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Discover how our platform combines chat and prediction capabilities to deliver
                      intelligent, data-driven solutions tailored to your needs.
                    </p>
                  </NavigationMenuLink>
                </li>

                {/* Right column - 3 smaller links */}
                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium text-sm leading-none">Deep Dive</div>
                    <p className="mt-1 line-clamp-2 text-muted-foreground text-xs leading-snug">
                      See how exactly things work under the hood 🔍
                    </p>
                  </NavigationMenuLink>
                </li>

                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium text-sm leading-none">What's Next ?</div>
                    <p className="mt-1 line-clamp-2 text-muted-foreground text-xs leading-snug">
                      See what we're working on 🧑‍💻
                    </p>
                  </NavigationMenuLink>
                </li>

                <li>
                  <NavigationMenuLink href="#">
                    <div className="flex items-center gap-1 font-medium text-sm leading-none">
                      <span>Follow us on</span>
                      <FaXTwitter />
                    </div>

                    <p className="mt-1 line-clamp-2 text-muted-foreground text-xs leading-snug">
                      Read our latest blog posts.
                    </p>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/chat">Chat</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/predict">Predict</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu viewport={false}>
        <NavigationMenuList className="ml-auto">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
            <NavigationMenuContent className="right-0 left-auto">
              <ul className="grid w-[200px] gap-4">
                {user && (
                  <li className="border-b px-2 py-1 text-muted-foreground text-sm">
                    Signed in as: {user.email}
                  </li>
                )}
                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Profile Settings</div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <div
                    className={`flex flex-row items-center gap-2 ${navigationMenuTriggerStyle()}`}
                  >
                    <div className="font-medium">Theme</div>
                    <ThemeSwitcher />
                  </div>
                </li>
                {user ? (
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-sm p-2 text-left hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="font-medium">Logout</div>
                    </button>
                  </li>
                ) : (
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/login">
                        <div className="font-medium">Login</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
