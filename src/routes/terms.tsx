import { createFileRoute } from "@tanstack/react-router";
import { Block, PageShell } from "@/components/page-shell";
import { HardMark } from "@/components/site-header";
import { site } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of service — SUPERAF.CA" },
      {
        name: "description",
        content:
          "SUPERAF.CA terms of service. Quotes, vehicle condition, warranty, and limitation of liability for paint protection film, tint, and windshield film in Calgary.",
      },
    ],
  }),
});

function TermsPage() {
  return (
    <PageShell
      title="Terms of service."
      lede="Please read these terms before booking. By submitting a quote you agree to them."
    >
      <Block title="1. Services">
        <p>
          SUPERAF.CA provides paint protection film, windshield protection film,
          and window tinting from {site.address}. All work is subject to
          availability, vehicle inspection, and our approval.
        </p>
        <p>
          We operate from a subleased indoor bay. Please call or text before
          arriving. Mobile service is seasonal (May–October), indoor and
          temperature-controlled only, billed as an extra, and may be declined
          for weather or an unsuitable site.
        </p>
      </Block>

      <Block title="2. Quotes and booking">
        <p>
          Website prices are starting estimates based on vehicle size and
          package. Final price is confirmed after we inspect the vehicle. Body
          kits, sensors, paint condition, prior work, and added panels can
          change the total.
        </p>
        <p>
          A quote is not a contract. Booking is confirmed when we accept the
          job and agree on coverage, schedule, and price. Promotional pricing
          ends when books are full or on the published end date.
        </p>
        <p>
          Please give at least 24 hours’ notice to cancel or reschedule. Late
          cancellations and no-shows may forfeit any deposit.
        </p>
      </Block>

      <Block title="3. Vehicle condition">
        <p>You must disclose, before work begins:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Existing damage, chips, and paint defects</li>
          <li>Prior film, wrap, or coating</li>
          <li>Repaint, bodywork, or aftermarket parts</li>
        </ul>
        <p>
          SUPERAF.CA is not responsible for issues that arise from pre-existing
          damage, poor or failing paint, aftermarket modifications, or
          conditions that were not disclosed.
        </p>
        <p>
          We may decline a vehicle that is too dirty, too damaged, or not a
          suitable candidate for the product requested.
        </p>
      </Block>

      <Block title="4. Product and workmanship">
        <p>
          Paint protection film, windshield film, and window tint are
          sacrificial products. They absorb impact, abrasion, and
          environmental wear so the vehicle’s original surfaces do less of
          that work. They are not armour and they do not make a vehicle
          damage-proof.
        </p>
        <p>
          Installations are performed by hand. Minor imperfections can occur
          and may relate to paint colour, paint condition, panel shape, and
          environment. We do not guarantee 100% coverage or a perfect
          appearance.
        </p>
        <p>
          Windshield film may show distortion, moisture during cure, and
          wiper wear over time. Window tint must comply with applicable law.
          Customers are responsible for checking current Alberta guidelines.
        </p>
      </Block>

      <Block title="5. Warranty">
        <p>
          <HardMark /> manufacturer warranty covers yellowing, staining,
          cracking, blistering, and delamination or peeling caused by
          manufacturing failure. It does not cover impact, wear, weather,
          washing equipment, or chemical damage.
        </p>
        <p>
          Warranty does not cover accidents, vandalism, misuse, improper
          aftercare, or work performed by a third party. Follow the aftercare
          instructions we provide. Alterations without our written consent
          void related coverage.
        </p>
        <p>
          Concerns about our install are handled with us directly, case by
          case.
        </p>
      </Block>

      <Block title="6. Limitation of liability">
        <p>SUPERAF.CA is not liable for:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Hail, ice, or storm damage</li>
          <li>
            Damage while the vehicle is parked outside, at your home, at work,
            or anywhere that is not our bay
          </li>
          <li>Road debris, gravel, sand, and other impact after the vehicle leaves our care</li>
          <li>Tree sap, bird droppings, industrial fallout, and similar environmental exposure</li>
          <li>Automatic car washes, pressure washers, and improper cleaning</li>
          <li>Theft, vandalism, or third-party work</li>
          <li>Personal items left in the vehicle</li>
          <li>
            Indirect or consequential loss, including rental vehicles, loss of
            use, towing, downtime, or alleged loss of vehicle value
          </li>
        </ul>
        <p>
          Once the vehicle is released to you, risk of loss and damage returns
          to you. Our total liability for any claim related to a job is limited
          to the amount paid to SUPERAF.CA for that job, to the extent
          permitted by law.
        </p>
      </Block>

      <Block title="7. Photography">
        <p>
          We may photograph or video the vehicle for quality control and shop
          use. If you do not consent, please tell us in writing before work
          starts.
        </p>
      </Block>

      <Block title="8. Contact">
        <p>
          SUPERAF.CA · {site.address}
          <br />
          {site.email} · {site.hours}
        </p>
      </Block>
    </PageShell>
  );
}
