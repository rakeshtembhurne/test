import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

const metaOpts = {
  title: "Managers",
  description: "All users with MANAGER role",
};

export default function OrdersLoading() {
  return (
    <>
      <DashboardHeader heading={metaOpts.title} text={metaOpts.description} />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
