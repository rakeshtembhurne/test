import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { getUsersByRole } from "@/lib/user";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DataTable } from "@/components/data-table/data-table";
import { columns, User } from "@/app/(protected)/admin/users/column";

const metaOpts = {
  title: "Users",
  description: "All non-admin users",
};
export const metadata = constructMetadata(metaOpts);

async function getData(): Promise<User[]> {
  return (await getUsersByRole(UserRole.USER)) || [];
}

export default async function UsersByRole() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  const data = (await getData()) || [];

  console.log({ data });

  return (
    <DashboardShell>
      <DashboardHeader
        heading={metaOpts.title}
        text={metaOpts.description}
      ></DashboardHeader>
      <div className="overflow-auto rounded-[0.5rem] border bg-background shadow">
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </DashboardShell>
  );
}