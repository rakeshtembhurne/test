"use client";

import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminUserActions from "@/app/(protected)/admin/users/actions";

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
    cell: ({ row }) => {
      const _row = row.original;
      return (
        <div className="space-x-2">
          <Button variant="success" size="sm">
            Make Admin
          </Button>
          <Button variant="default" size="sm">
            Assign Manager
          </Button>
        </div>
      );
    },
  },
  {
    id: "newActions",
    cell: ({ row }) => <AdminUserActions row={row} />,
  },
];
