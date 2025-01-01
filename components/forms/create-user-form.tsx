"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/actions/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { CreateUserSchema } from "@/lib/validations/user";

interface CreateUserFormProps {
  managerId?: string;
  managers?: User[];
  onlyRole?: UserRole;
  redirectUrl: string;
}
export const CreateUserForm = ({
  managerId,
  managers = [],
  onlyRole,
  redirectUrl,
}: CreateUserFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      managerId: managerId || null,
      name: "",
      email: "",
      password: "",
      role: onlyRole || UserRole.USER,
    },
  });

  console.log({ errors: form.formState.errors });

  const onSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    setIsPending(true);
    try {
      const result = await createUser(values);

      if (result.success) {
        toast.success(result.success);
        form.reset();
        router.push(redirectUrl);
      }

      if (result.error) {
        toast.error(result.error);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            {...form.register("name")}
            type="text"
            className="mt-1 block w-full rounded-md border p-2"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            {...form.register("email")}
            type="email"
            className="mt-1 block w-full rounded-md border p-2"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password (Optional)
          </label>
          <input
            {...form.register("password")}
            type="password"
            className="mt-1 block w-full rounded-md border p-2"
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {onlyRole && onlyRole === UserRole.USER ? (
          <div>
            <label htmlFor="role" className="block text-sm font-medium">
              Manager
            </label>
            <select
              {...form.register("managerId")}
              className="mt-1 block w-full rounded-md border p-2"
            >
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
            {form.formState.errors.managerId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.managerId.message}
              </p>
            )}
          </div>
        ) : null}

        {managerId ? (
          <input type="hidden" {...form.register("managerId")} />
        ) : null}

        {onlyRole ? (
          <input type="hidden" name="role" value={onlyRole} />
        ) : (
          <div>
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <select
              {...form.register("role")}
              className="mt-1 block w-full rounded-md border p-2"
            >
              <>
                <option value={UserRole.USER}>User</option>
                <option value={UserRole.MANAGER}>Manager</option>
              </>
            </select>
            {form.formState.errors.role && (
              <p className="text-sm text-red-500">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
