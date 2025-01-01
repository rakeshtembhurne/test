"use client";

import { useTransition } from "react";
import { syncChartsData, type FormData } from "@/actions/charts";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { emptySchema } from "@/lib/validations/empty";
import { Button } from "@/components/ui/button";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserNameFormProps {
  user: Pick<User, "id" | "role">;
}

export function SyncChartsForm({ user }: UserNameFormProps) {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const updateUserNameWithId = syncChartsData.bind(null, user.id);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(emptySchema),
    defaultValues: {},
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status, message } = await updateUserNameWithId(data);

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: message || "Unable sync at this time.",
        });
      } else {
        await update();
        toast.success("Charts has been synced.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Sync Charts"
        description="Refresh the data from servers"
      >
        <div className="flex w-full items-center gap-2">
          <Button
            type="submit"
            variant="default"
            disabled={isPending}
            className="w-[67px] shrink-0 px-0 sm:w-[130px]"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>Sync Charts</p>
            )}
          </Button>
        </div>
      </SectionColumns>
    </form>
  );
}
