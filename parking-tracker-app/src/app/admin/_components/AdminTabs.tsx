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

export default function AdminTabs() {
  return (
    <Tabs defaultValue="create" className="w-screen">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="create">Add Parking Lot</TabsTrigger>
        <TabsTrigger value="password">
          See Illegally Parcked Vehicle
        </TabsTrigger>
        <TabsTrigger value="parkings">Parking Lists</TabsTrigger>
      </TabsList>
      <AddParking />
      <ParkingList />
      <IllegalParkers />
    </Tabs>
  );
}
