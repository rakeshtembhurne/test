import Link from "next/link";
import { redirect } from "next/navigation";
import { PointHistory } from "@prisma/client";

import { getUserPointHistory, getUserPoints } from "@/lib/point";
import { getCurrentUser } from "@/lib/session";
import { cn, constructMetadata } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DataTable } from "@/components/data-table/data-table";

import { Auction, columns } from "./column.jsx";

const metaOpts = {
  title: "Points",
  description: "View Your Points History",
};
export const metadata = constructMetadata(metaOpts);

async function getData(userId: string): Promise<PointHistory[]> {
  return (await getUserPointHistory(userId)) || [];
}

export default async function UserPointsPage({
  params,
}: {
  params: { userId: string };
}) {
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser?.id) redirect("/login");
  const userId = params?.userId;
  const points = await getUserPoints(userId);

  const data = (await getData(userId)).map((d) => {
    return {
      ...d,
      date: new Date(d.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`${metaOpts.title}: ${points}`}
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
