import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCharts } from "@/lib/chart";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DataTable } from "@/components/data-table/data-table";
import { Chart, columns } from "@/app/(protected)/admin/charts/column";

const metaOpts = {
  title: "Charts",
  description: "All the charts",
};
export const metadata = constructMetadata(metaOpts);

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensures the result is in AM/PM format
  });
}

async function getData() {
  const charts = ((await getCharts()) || []).map((chart) => {
    const startTime = chart.startTime
      ? formatTime(new Date(chart.startTime))
      : null;

    const endTime = chart.endTime ? formatTime(new Date(chart.endTime)) : null;
    return {
      ...chart,
      startTime,
      endTime,
    };
  });
  return charts;
}

export default async function UsersByRole() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  const data = (await getData()) || [];

  return (
    <DashboardShell>
      <DashboardHeader heading={metaOpts.title} text={metaOpts.description}>
        <Button variant="info">
          <a href="/admin/managers/create">Add New Manager</a>
        </Button>
      </DashboardHeader>
      <div className="overflow-auto rounded-[0.5rem] border bg-background shadow">
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </DashboardShell>
  );
}
