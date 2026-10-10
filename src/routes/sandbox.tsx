import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sandbox")({
  head: () => ({
    meta: [
      { title: "SUPERAF.CA — Design Lab 002" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  component: Sandbox,
});

function Sandbox() {
  return (
    <iframe
      title="SUPERAF interactive design sandbox"
      src="/design-lab/index.html"
      style={{
        display: "block",
        width: "100%",
        height: "100dvh",
        border: 0,
        background: "#f9fafc",
      }}
    />
  );
}
