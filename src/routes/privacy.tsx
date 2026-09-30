import { createFileRoute } from "@tanstack/react-router";
import { Block, PageShell } from "@/components/page-shell";
import { site } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy — SUPERAF.CA" },
      {
        name: "description",
        content:
          "SUPERAF.CA privacy. Name, number, email, and vehicle for quotes. Sent to book@superaf.ca. Not sold.",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <PageShell
      title="Privacy."
      lede="We take what we need to quote the car. We don’t sell it."
    >
      <Block title="What we take">
        <p>When you level up we collect:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Name</li>
          <li>Phone</li>
          <li>Email</li>
          <li>Preferred contact — call, text, or WhatsApp</li>
          <li>Year, make, model, size</li>
          <li>Package, film, tint, windshield, notes</li>
        </ul>
        <p>
          That’s it. No account. No birthday. No driver’s licence unless you
          later send one for something else, which you shouldn’t need.
        </p>
      </Block>
      <Block title="Why">
        <p>
          To send you a virtual quote, book the bay, and confirm price on the
          car. If you pick text or WhatsApp we open a message so you have a copy
          too.
        </p>
      </Block>
      <Block title="Where it goes">
        <p>
          Leads forward to {site.email}. That’s the inbox. We may also see the
          quote in our phones when you text or WhatsApp us.
        </p>
        <p>
          Your browser stores the name, number, email, and preferred contact in
          local storage so the form isn’t empty next time. That’s on your
          device. Clear it whenever you want.
        </p>
        <p>We do not sell this. We do not rent this. We do not run ads off it.</p>
      </Block>
      <Block title="How long">
        <p>
          Quote mail stays as long as we need it to do the job and keep a
          record of what was booked. Ask us to delete it and we will, unless we
          have to keep it for tax or a dispute.
        </p>
      </Block>
      <Block title="Your move">
        <p>
          Email {site.email} to see, fix, or delete what we have. Alberta and
          Canadian privacy law apply. If you are in the EU this shop is still in
          Calgary — we are not running a European product.
        </p>
        <p>
          Instagram @{site.ig} is public. Don’t put a private complaint in a
          comment and expect it to stay private.
        </p>
      </Block>
    </PageShell>
  );
}
