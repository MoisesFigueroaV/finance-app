import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  await auth.protect();

  return (
    <Button variant="destructive">
        Click Me
    </Button>
  );
}
