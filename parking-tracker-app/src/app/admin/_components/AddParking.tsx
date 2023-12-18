import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddParking() {
  const addParking = () => {};

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="latitude" className="text-purple-700 font-bold">
          Latitude
        </Label>
        <Input
          id="latitude"
          placeholder="25.0137"
          defaultValue=""
          className="border border-purple-500 rounded-md p-2"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="longitude" className="text-blue-700 font-bold">
          Longitude
        </Label>
        <Input
          id="longitude"
          placeholder="121.5347"
          defaultValue=""
          className="border border-blue-500 rounded-md p-2"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="uuid" className="text-green-700 font-bold">
          UUID
        </Label>
        <Input
          id="uuid"
          placeholder="Device UUID"
          defaultValue=""
          className="border border-green-500 rounded-md p-2"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="availableSlots" className="text-red-700 font-bold">
          Available Slots
        </Label>
        <Input
          id="availableSlots"
          placeholder="10"
          defaultValue=""
          className="border border-red-500 rounded-md p-2"
        />
      </div>
      <Button
        onClick={addParking}
        className="bg-purple-700 text-white p-2 rounded-md hover:bg-purple-800"
      >
        Save changes
      </Button>
    </div>
    
  );
}
