import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { CreateUserForm } from "@/components/forms/create-user-form";

const meta = {
  title: "Add New User",
  description: "Add new user to the system",
};
export const metadata = constructMetadata(meta);

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (user?.role !== UserRole.MANAGER) redirect("/login");

  return (
    <>
      <DashboardHeader heading={meta.title} text={meta.description} />
      <Card className="p-4">
        <CreateUserForm
          managerId={user.id}
          onlyRole={UserRole.MANAGER}
          redirectUrl="/manager/users"
        />
      </Card>
    </>
  );
}
