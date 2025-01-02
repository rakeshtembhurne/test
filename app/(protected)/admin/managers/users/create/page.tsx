import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { getUsersByRole } from "@/lib/user";
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

  if (user?.role !== UserRole.ADMIN) redirect("/login");

  const managers = await getUsersByRole(UserRole.MANAGER);

  return (
    <>
      <DashboardHeader heading={meta.title} text={meta.description} />
      <Card className="p-4">
        <CreateUserForm
          managers={managers}
          onlyRole={UserRole.USER}
          redirectUrl="/admin/users"
        />
      </Card>
    </>
  );
}
