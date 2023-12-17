import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddParking() {
  const addParking = () => {};

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          placeholder="25.01370607644918"
          defaultValue=""
          className="border border-black"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          id="longitude"
          placeholder="121.53468199176018"
          defaultValue=""
          className="border border-black"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="uuid">UUID</Label>
        <Input
          id="uuid"
          placeholder="Device UUID"
          defaultValue=""
          className="border border-black"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="availableSlots">Available Slots</Label>
        <Input
          id="availableSlots"
          placeholder="10"
          defaultValue=""
          className="border border-black"
        />
      </div>
      <Button onClick={addParking}>Save changes</Button>
    </div>
  );
}
