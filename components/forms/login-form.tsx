"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/actions/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { LoginSchema } from "@/lib/validations/auth";
import { z } from "zod";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setIsPending(true);

    try {
      const result = await login(values, callbackUrl);

      if (result?.error) {
        setError(result.error);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            {...form.register("email")}
            type="email"
            placeholder="john.doe@example.com"
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
            Password
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
      </div>
      {error && (
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {isPending ? "Loading..." : "Sign In"}
      </button>
    </form>
  );
};
