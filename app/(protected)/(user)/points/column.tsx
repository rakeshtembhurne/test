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
    header: "Date",
  },
  {
    accessorKey: "previousPoints",
    header: "Previous Points",
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "newPoints",
    header: "New Points",
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
