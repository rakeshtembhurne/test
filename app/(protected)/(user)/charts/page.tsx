import { redirect } from "next/navigation";

import { getCharts, getPublicCharts } from "@/lib/chart";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata, getTimeStatus } from "@/lib/utils";
import ChartCard from "@/components/charts/chart-card";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "Charts",
  description: "All the charts",
});

export default async function UserChartsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const charts = (await getPublicCharts()) || [];
  const chartsWithStatus = charts.map((chart) => {
    return {
      ...chart,
      status: getTimeStatus(chart.startTime, chart.endTime),
    };
  });
  const chartsInProgress = chartsWithStatus.filter(
    (chart) => chart.status === "currentlyInProgress",
  );
  const chartsYetToArrive = chartsWithStatus.filter(
    (chart) => chart.status === "yetToArrive",
  );
  const chartsAlreadyPassed = chartsWithStatus.filter(
    (chart) => chart.status === "alreadyPassed",
  );

  return (
    <>
      <DashboardHeader heading="Charts" text="All the charts available" />
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl text-yellow-500">In Progress</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {chartsInProgress.map((chart) => (
            <ChartCard key={chart.id} chart={chart} color="yellow" />
          ))}
        </div>
        <hr />
        <h2 className="text-2xl text-green-500">Upcoming</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {chartsYetToArrive.map((chart) => (
            <ChartCard key={chart.id} chart={chart} color="green" />
          ))}
        </div>
        <hr />
        <h2 className="text-2xl text-red-500">Done for Today</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {chartsAlreadyPassed.map((chart) => (
            <ChartCard key={chart.id} chart={chart} color="red" />
          ))}
        </div>
      </div>
    </>
  );
}
