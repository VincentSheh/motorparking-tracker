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
import { TabsContent } from "@/components/ui/tabs";

export default function AddParking() {
  const addParking = () => {};
  return (
    <TabsContent value="create">
      <Card>
        <CardHeader>
          <CardTitle>Add Parking Location</CardTitle>
          <CardDescription>
            Make changes to your account here. Click save when you're done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Latitude</Label>
            <Input id="name" placeholder="25.01370607644918" defaultValue="" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Longitude</Label>
            <Input id="name" placeholder="121.53468199176018" defaultValue="" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">UUID</Label>
            <Input id="username" placeholder="Device UUID" defaultValue="" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Available Slots</Label>
            <Input id="name" placeholder="10" defaultValue="" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addParking}>Save changes</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
