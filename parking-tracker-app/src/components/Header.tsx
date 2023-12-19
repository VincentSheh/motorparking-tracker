"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="hidden md:flex bg-black bg-opacity-25 flex-row items-center justify-between py-5 top-0 z-50 relative w-full header">
      <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl ml-5 font-cursive whitespace-nowrap">
        PARKING TRACKER
      </h2>
      <div className="flex flex-row items-center mr-5">
        <Link className={`px-2 text-black hover:text-gray-800 ${isHomePage ? 'underline' : ''} font-cursive nav-link`} href={isHomePage ? "/admin" : "/"}>
          {isHomePage ? "Admin" : "Home"}
        </Link>
        <UserButton />
        <Link className="px-2 text-black hover:text-gray-800 underline font-cursive nav-link" href="/map">
          Map
        </Link>
      </div>
    </div>
  );
}

