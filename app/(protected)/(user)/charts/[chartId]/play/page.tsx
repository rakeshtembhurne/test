import { redirect } from "next/navigation";

import { getChartById } from "@/lib/chart";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { PlayChartForm } from "@/components/charts/play-chart-form";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { SyncChartsForm } from "@/components/forms/sync-charts-form";
import { UserRoleForm } from "@/components/forms/user-role-form";

export const metadata = constructMetadata({
  title: "Play Chart",
  description: "Play your favorite chart",
});

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ chartId: string }>;
}) {
  const user = await getCurrentUser();

  if (!user?.id || user.role !== "USER") redirect("/login");
  const { chartId } = await params;
  const chart = await getChartById(chartId);

  return (
    <>
      <DashboardHeader
        heading={chart?.title || "Play Chart"}
        text="Play chart now"
      />
      <div className="divide-y divide-muted pb-10">
        <PlayChartForm
          chartId={chartId}
          user={{ id: user.id, name: user.name || "" }}
        />
      </div>
    </>
  );
}
