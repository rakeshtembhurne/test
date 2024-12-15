import { redirect } from "next/navigation";

import { getChartById, getChartResults } from "@/lib/chart";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ResultCard from "@/components/charts/result-card";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

const meta = {
  title: "Chart Details",
  description: "",
};
export const metadata = constructMetadata(meta);

export default async function ChartDetailsPage({
  params,
}: {
  params: { chartId: string };
}) {
  // const user = await getCurrentUser();
  // if (!user || user.role !== "ADMIN") redirect("/login");
  const chartId = params?.chartId;
  const chart = await getChartById(chartId);
  const results = await getChartResults(chartId);

  return (
    <>
      <DashboardHeader heading={chart?.title || meta.title} text="" />
      <div>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {results.map((r) => (
            <ResultCard key={r.id} result={r} />
          ))}
        </div>
      </div>
    </>
  );
}
