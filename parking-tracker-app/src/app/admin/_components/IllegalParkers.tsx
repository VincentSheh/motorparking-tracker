import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function IllegalParkers() {
  const changePassword = () => {};

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="current">Current password</Label>
        <Input id="current" type="password" className="border border-black" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new">New password</Label>
        <Input id="new" type="password" className="border border-black" />
      </div>
      <Button onClick={changePassword}>Save password</Button>
    </div>
  );
}
