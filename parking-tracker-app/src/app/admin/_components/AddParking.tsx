'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

export default function AddParking() {
  const[latitude, setLatitude] = useState<string>('')
  const[longitude, setLongitude] = useState<string>('')
  const[uuid, setUuid] = useState<string>('')
  const[maxSpace, setMaxSpace] = useState<number>(10)
  const[polygon, setPolygon] = useState<string>('')

  const handleInputChange = (
    e:ChangeEvent<HTMLInputElement>,
    setVariable:Dispatch<SetStateAction<string>>) => {
    setVariable(e.target.value);
  }
  const handleInputChangeNum = (
    e:ChangeEvent<HTMLInputElement>,
    setVariable:Dispatch<SetStateAction<number>>) => {
    
      const value = parseInt(e.target.value, 10);
      setVariable(value);
  }
  const handleUpdateDB = async () =>{
    const res = await fetch(`/api/parkings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "update",
        data:{
          id: uuid,
          latitude: latitude,
          longitude: longitude,
          maxSpace: maxSpace,
          polygon: polygon
        }
      }),
    });      
    if (!res.ok){
      console.log(res)
      console.log("NOT OK")
      alert("Invalid Inputs, is the UUID in the correct format")
      return
    }

  }

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="uuid" className="text-green-700 font-bold">
          UUID
        </Label>
        <Input
          id="uuid"
          placeholder="Device UUID"
          defaultValue=""
          className="border border-green-500 rounded-md p-2"
          onChange={(e) => handleInputChange(e, setUuid)}

        />
      </div>      
      <div className="space-y-1">
        <Label htmlFor="latitude" className="text-purple-700 font-bold">
          Latitude
        </Label>
        <Input
          id="latitude"
          placeholder="25.0137"
          className="border border-purple-500 rounded-md p-2"
          onChange={(e) => handleInputChange(e, setLatitude)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="longitude" className="text-blue-700 font-bold">
          Longitude
        </Label>
        <Input
          id="longitude"
          placeholder="121.5347"
          className="border border-blue-500 rounded-md p-2"
          onChange={(e) => handleInputChange(e, setLongitude)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="availableSlots" className="text-red-700 font-bold">
          Available Slots
        </Label>
        <Input
          id="availableSlots"
          placeholder="10"
          className="border border-red-500 rounded-md p-2"
          onChange={(e) => handleInputChangeNum(e, setMaxSpace)}

        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="polygon" className="text-blue-700 font-bold">
          Polygon Coordinates
        </Label>
        <Input
          id="longitude"
          placeholder="A Python 2d list"
          className="border border-blue-500 rounded-md p-2"
          onChange={(e) => handleInputChange(e, setPolygon)}

        />
      </div>      
      <Button
        onClick={handleUpdateDB}
        className="bg-purple-700 text-white p-2 rounded-md hover:bg-purple-800"
      >
        Save changes
      </Button>
    </div>
    
  );
}
