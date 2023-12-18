import Link from "next/link";
import Button from "@/components/Button";
import MotorparkingTrackerList from "@/components/List";
import LatestImage from "./admin/_components/image";
const Home = () => {
  return (
    
    <div className="flex flex-col h-screen items-center justify-center bg-black relative">
      <div className="absolute inset-0 z-10 bg-black opacity-75"></div>
      <video autoPlay loop muted className="absolute inset-0 object-cover z-0 w-9/10 h-80vh">
        <source src="/earth.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-20 text-center text-white">
        <MotorparkingTrackerList />
        <div className="mt-8 flex items-center justify-center">
          <Button as={Link} href="/map" text="Try Now!" pict="/motor.png" alt="Motorcycle"/>
        </div>
      </div>
    </div>
  );
};

export default Home;
