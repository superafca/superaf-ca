import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/kits")({
  beforeLoad: () => {
    throw redirect({ to: "/diy" });
  },
});
