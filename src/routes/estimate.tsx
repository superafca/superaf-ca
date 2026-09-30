import { createFileRoute, Link } from "@tanstack/react-router";
import { Quote } from "@/components/quote";

export const Route = createFileRoute("/estimate")({
  component: Estimate,
  head: () => ({
    meta: [
      { title: "Build your estimate — PPF Calgary | SUPERAF.CA" },
      {
        name: "description",
        content:
          "Build your estimate. FRONT, FRONT+, MAX. Paint protection. Glass protection. Tint Calgary.",
      },
    ],
  }),
});

function Estimate() {
  return (
    <div className="arcade-page">
      <div className="arcade-cabinet">
        <p className="arcade-marquee">SUPERAF · STAGE SELECT</p>
        <div className="arcade-bezel">
          <Quote />
        </div>
        <Link to="/" className="arcade-exit">
          <span className="arcade-exit-arrow" aria-hidden />
          EXIT TO STORE
        </Link>
      </div>
    </div>
  );
}
