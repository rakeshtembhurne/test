"use client";

import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/shared/icons";
import { DataTableActions } from "@/app/(protected)/games/actions";

export type Auction = Prisma.Args<typeof prisma.auction, "create">["data"];

export const columns: ColumnDef<Auction>[] = [
  {
    accessorKey: "date",
    header: "Game Date",
  },
  {
    accessorKey: "chart.title",
    header: "Chart",
  },
  {
    accessorKey: "auctionType",
    header: "Game Type",
  },
  {
    accessorKey: "expectedResult",
    header: "Expected Result",
  },
  {
    accessorKey: "amount",
    header: () => <div className="">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "approved",
    header: "Is Approved",
    cell: ({ row }) => {
      const isApproved = parseFloat(row.getValue("approved"));
      return isApproved ? (
        <Badge variant="outline">Yes</Badge>
      ) : (
        <Badge variant="destructive">No</Badge>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const _row = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="size-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="size-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem>
  //             <Icons.pencil className="mr-2 size-4" />
  //             <Link href={`/dashboard/banks/${_row?.id}/edit`}>Edit</Link>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
