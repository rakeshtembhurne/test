"use client";

import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { prisma } from "@/lib/db";

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
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "newPoints",
    header: "New Points",
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
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
