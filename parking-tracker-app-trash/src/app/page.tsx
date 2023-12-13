import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-blue-600 ">
      <div className="mb-2 text-2xl font-bold text-blue-950 md:text-3xl lg:text-4xl xl:text-5xl">
        MOTORCYCE PARKING TRACKER
      </div>
      <div className="text-1xl mb-6 font-bold text-blue-800 md:text-2xl lg:text-3xl xl:text-4xl">
        Make Your Life Easier
      </div>
      <Button as={Link} href="/map" text="Start Parking" pict="/motor.png" alt="Motorcycle"/>
    </div>
  );
}
