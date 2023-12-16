"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddParking from "./AddParking";
import IllegalParkers from "./IllegalParkers";
import ParkingList from "./ParkingList";
import LatestImage from "./image";

export default function AdminTabs() {
  return (
    <Tabs defaultValue="create" className="w-screen">
      <TabsList className="grid w-full grid-cols-4">
        <div className="text-center border-r-2 py-1">
          <TabsTrigger value="create">Add Parking Lot</TabsTrigger>
        </div>
        <div className="text-center border-r-2 py-1">
          <TabsTrigger value="password">See Illegally Parked Vehicle</TabsTrigger>
        </div>
        <div className="text-center border-r-2 py-1">
        <TabsTrigger value="parkings">Parking Lists</TabsTrigger>
        </div>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>
      <AddParking />
      <ParkingList />
      <IllegalParkers />
      <LatestImage folderPath="images" alt="Latest Image" />

    </Tabs>
  );
}
