import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getUserCountsByRole } from "@/lib/dashboard";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import TransactionsList from "@/components/dashboard/transactions-list";

const metadataConf = {
  title: "Admin Panel",
  description: "Everything at One Place",
};
export const metadata = constructMetadata(metadataConf);

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const adminCounts = await getUserCountsByRole();

  return (
    <>
      <DashboardHeader
        heading={metadataConf.title}
        text={metadataConf.description}
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            title="Managers"
            stats={adminCounts[UserRole.MANAGER]}
            description="Total number of managers"
          />
          <InfoCard
            title="Users"
            stats={adminCounts[UserRole.USER]}
            description="Total number of users"
          />
          <InfoCard
            title="Admins"
            stats={adminCounts[UserRole.ADMIN]}
            description="Total number of admins"
          />

          {/* <InfoCard /> */}
        </div>
        {/* <TransactionsList /> */}
      </div>
    </>
  );
}
