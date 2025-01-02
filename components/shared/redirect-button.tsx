"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function RedirectButton({
  type,
  label,
}: {
  type?: string;
  label: string;
}) {
  const router = useRouter();

  const handleRedirect = () => {
    const currentUrl = new URL(window.location.href);
    if (type) {
      currentUrl.searchParams.set("type", type);
    } else {
      currentUrl.searchParams.set("type", "");
    }

    router.push(currentUrl.toString());
  };

  return (
    <Button variant="default" onClick={handleRedirect}>
      {label}
    </Button>
  );
}
