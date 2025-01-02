import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import TransactionsList from "@/components/dashboard/transactions-list";

const metadataConf = {
  title: "Manager Panel",
  description: "All non-admin users",
};
export const metadata = constructMetadata(metadataConf);

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "MANAGER") redirect("/login");

  return (
    <>
      <DashboardHeader
        heading={metadataConf.title}
        text={metadataConf.description}
      />
      <div className="flex flex-col gap-5">
        {/* <TransactionsList /> */}
        {/* <TransactionsList /> */}
      </div>
    </>
  );
}
