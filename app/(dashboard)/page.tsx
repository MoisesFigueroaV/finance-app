import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  await auth.protect();

  return (
    <div>
      <h1>
        Dashboard Page
      </h1>


    </div>
  );
}
