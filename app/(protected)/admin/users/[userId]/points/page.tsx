import Link from "next/link";
import { redirect } from "next/navigation";
import { PointHistory } from "@prisma/client";

import { getUserPointHistory, getUserPoints } from "@/lib/point";
import { getCurrentUser } from "@/lib/session";
import { getUserById } from "@/lib/user";
import { cn, constructMetadata } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DataTable } from "@/components/data-table/data-table";

import { Auction, columns } from "./column";

const metaOpts = {
  title: "Points",
  description: "View User Points History",
};
export const metadata = constructMetadata(metaOpts);

async function getData(userId: string): Promise<PointHistory[]> {
  return (await getUserPointHistory(userId)) || [];
}

export default async function AdminPointsPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = params?.userId;
  const [loggedInUser, user] = await Promise.all([
    getCurrentUser(),
    getUserById(userId),
  ]);

  if (!loggedInUser?.id) redirect("/login");
  const points = await getUserPoints(userId);
  console.log({ user, points });

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
        heading={`${user?.name} ${metaOpts.title}`}
        text={`Manager: ${user?.manager?.name}, Points: ${user?.points?.currentPoints}`}
      ></DashboardHeader>
      <div className="overflow-auto rounded-[0.5rem] border bg-background shadow">
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </DashboardShell>
  );
}
