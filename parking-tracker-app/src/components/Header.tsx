"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="bg-white flex flex-col md:flex-row items-center justify-center py-3 md:py-5 top-0 z-50 relative">
      <div className="flex flex-col md:flex-row items-center px-3 md:px-5 mb-2 md:mb-0 md:absolute start-0">
        <UserButton />
        <Link className="px-2" href={isHomePage ? "/admin" : "/"}>
          {isHomePage ? "Admin" : "Home"}
        </Link>
      </div>
      <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-4xl mb-2 md:mb-0">
        PARKING TRACKER
      </h2>
      <div className="flex flex-col md:flex-row items-center px-3 md:px-5 md:absolute end-0">
        <Link className="px-2" href="/map">
          Map
        </Link>
      </div>
    </div>
  );
}