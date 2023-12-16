"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="bg-white flex flex-row items-center justify-center py-5 top-0 z-50 relative">
      <div className="flex flex-row items-center absolute px-5 start-0">
        <UserButton />
        <Link className="px-2" href={isHomePage ? "/admin" : "/"}>
          {isHomePage ? "Admin" : "Home"}
        </Link>
      </div>
      <div className="flex flex-row items-center absolute end-0 px-5 ">
        <Link className="px-2" href="/map">
          Map
        </Link>
      </div>
      <h2 className="text-2xl font-bold text-blue-950 md:text-3xl lg:text-4xl xl:text-4xl">
        PARKING TRACKER
      </h2>
    </div>
  );
}
