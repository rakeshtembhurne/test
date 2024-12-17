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

export type User = Prisma.Args<typeof prisma.user, "create">["data"];

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "User Role",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const _row = row.original;
      return (
        <div className="space-x-2">
          <Button variant="info" size="sm">
            <Icons.pencil className="mx-1 size-4" />
          </Button>
          <Button variant="destructive" size="sm">
            <Icons.trash className="mx-1 size-4" />
          </Button>
        </div>
      );
    },
  },
];
