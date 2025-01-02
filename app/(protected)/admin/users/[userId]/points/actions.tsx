import React, { useState } from "react";
// FIXME: Use proper loads
import { Loader2, Shield, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// TODO: Rename properly
const DataTableActions = ({ row }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle making user an admin
  const handleMakeAdmin = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace this with your actual API endpoint
      const response = await fetch(`/api/users/${row.id}/make-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      // Handle success - you might want to refresh the table data here
    } catch (error) {
      console.error("Error updating user role:", error);
      // Handle error - you might want to show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle user deletion
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      // Replace this with your actual API endpoint
      const response = await fetch(`/api/users/${row.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Handle success - you might want to refresh the table data here
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error - you might want to show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Make Admin Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Shield className="size-4" />
            Make Admin
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Make User Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to give admin privileges to this user? This
              action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMakeAdmin}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash className="size-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DataTableActions;
