import { Metadata } from "next";

import { getAllAuctionStats, getAuctionStatsByDate } from "@/lib/auction";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import GameBoard from "@/components/dashboard/game-board";
import { DashboardHeader } from "@/components/dashboard/header";
import RedirectButton from "@/components/shared/redirect-button";

interface SearchParams {
  type?: string;
  date?: string;
}

export const metadata: Metadata = constructMetadata({
  title: "Dashboard – SaaS Starter",
  description: "Create and manage content.",
});

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getCurrentUser();
  const { type, date } = await searchParams;

  const data = await getAllAuctionStats(type, date);
  const stats = await getAuctionStatsByDate(type, date);

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role : ${user?.role} — Change your role in settings.`}
      />

      <div className="my-4 inline-flex gap-1 rounded-md shadow-sm" role="group">
        <RedirectButton label="All Games" />
        <RedirectButton type="OPEN" label="OPEN" />
        <RedirectButton type="OPEN_SINGLE_PATTI" label="OPEN SINGLE PATTI" />
        <RedirectButton type="OPEN_DOUBLE_PATTI" label="OPEN DOUBLE PATTI" />
        <RedirectButton type="CLOSE" label="CLOSE" />
        <RedirectButton type="CLOSE_SINGLE_PATTI" label="CLOSE SINGLE PATTI" />
        <RedirectButton type="CLOSE_DOUBLE_PATTI" label="CLOSE DOUBLE PATTI" />
      </div>
      <GameBoard data={data} title="All games" />
      <GameBoard data={stats} title="Game-wise Stats" />
    </>
  );
}
