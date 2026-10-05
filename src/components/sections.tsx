import { Link } from "@tanstack/react-router";
import { site } from "@/lib/site";

export function ContactStrip() {
  return (
    <section id="contact" className="store-mod">
      <div className="store-copy">
        <p className="store-kicker">Contact</p>
        <h2>{site.phone}</h2>
        <p className="store-lede">
          {site.address}. {site.plusCode}. {site.hours}.
        </p>
        <p className="store-links">
          <a className="store-link" href={site.phoneHref}>
            Call / text
          </a>
          <span className="store-link-dot" aria-hidden />
          <a className="store-link" href={site.emailHref}>
            Email
          </a>
        </p>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="store-foot">
      <nav>
        <Link to="/ppf">Paint Protection</Link>
        <Link to="/windshield">Glass Protection</Link>
        <Link to="/tint">Tint</Link>
        <Link to="/vision">Process and Values</Link>
        <Link to="/estimate">Estimate</Link>
        <Link to="/diy">DIY</Link>
        <Link to="/dealers">Dealers</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
      </nav>
      <div className="store-foot-grid">
        <div>
          <p className="store-foot-brand">SUPERAF.CA</p>
          <p className="mt-2">
            <a href={site.igHref}>Instagram @{site.ig}</a>
          </p>
          <p className="mt-1">
            <a href={site.googleReview} target="_blank" rel="noopener noreferrer">
              Review us on Google
            </a>
          </p>
        </div>
        <div>
          <p>{site.address}</p>
          <p>{site.hours}</p>
          <p>{site.hoursNote}</p>
        </div>
        <div>
          <p>
            <a href={site.phoneHref}>Call / text {site.phone}</a>
          </p>
          <p>
            <a href={site.emailHref}>{site.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
