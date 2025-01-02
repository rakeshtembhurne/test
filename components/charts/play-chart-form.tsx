"use client";

import { useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { playChart, type FormData } from "@/actions/play-chart";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuctionType, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { auctionSchema } from "@/lib/validations/chart";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserNameFormProps {
  user: Pick<User, "id" | "name">;
  chartId: string;
}

export function PlayChartForm({ user, chartId }: UserNameFormProps) {
  const [isPending, startTransition] = useTransition();
  const playUserChart = playChart.bind(null, user.id);

  const form = useForm<FormData>({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      chartId: chartId,
      amount: 10,
      auctionType: AuctionType.OPEN,
      expectedResult: 0,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((data) => {
    console.log("Submitting data", data);
    startTransition(async () => {
      const { status, message } = await playUserChart(data);

      if (status !== "success") {
        console.log({ errors });
        toast.error("Something went wrong.", {
          description: message || "The game could not be saved.",
        });
      } else {
        toast.success("Your game has been updated.");
        redirect("/games");
      }
    });
  });

  // console.log(JSON.stringify({ errors }));
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <SectionColumns
          title="Select Options"
          description="Select Options To play Chart"
        >
          <input type="hidden" name="chartId" value={chartId} />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="amount" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter amount in multiple of Rs. 10
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auctionType"
            render={({ field }) => (
              <FormItem className="mt-4 space-y-4">
                <FormLabel>Choose a Game Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {Object.values(AuctionType).map((auction) => (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={auction}
                      >
                        <FormControl>
                          <RadioGroupItem value={auction} />
                        </FormControl>
                        <FormLabel className="font-normal">{auction}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedResult"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Result Expected</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Expected Result"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter result you are expecting
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant={"default"}
            disabled={isPending}
            className="mt-3 w-[67px] shrink-0 px-0 sm:w-[130px]"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>
                Play
                <span className="hidden sm:inline-flex">&nbsp;Game</span>
              </p>
            )}
          </Button>
        </SectionColumns>
      </form>
    </Form>
  );
}
