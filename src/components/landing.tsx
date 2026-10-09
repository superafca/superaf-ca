import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GoogleReviews } from "@/components/google-reviews";
import { LiveStats } from "@/components/live-stat";
import { OptImg } from "@/components/opt-img";
import { AddressLink } from "@/components/sections";
import {
  PRICE_GUARANTEE,
  frontPlusLabel,
  fullBodyLabel,
  fullFrontLabel,
  tintFrontsCeramicLabel,
  tintFrontsLabel,
  visorLabel,
  windshieldFilmLabel,
  windshieldTintCeramicLabel,
  windshieldTintLabel,
} from "@/lib/price-anchors";
import { activeSeason, seasonCopy, seasonFromSearch } from "@/lib/season";
import { packages, proofStats, site } from "@/lib/site";

function canPlayMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "3g") return false;
  return true;
}

function FilmMedia({
  poster,
  video,
  alt,
  width,
  height,
}: {
  poster: string;
  video: string;
  alt: string;
  width: number;
  height: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = box.current;
    const vid = clip.current;
    if (!el || !vid) return;
    let dead = false;
    let shown = false;
    const motion = canPlayMotion();
    const play = () => {
      if (!motion || !shown || document.visibilityState === "hidden") {
        vid.pause();
        return;
      }
      if (!vid.getAttribute("src")) vid.src = video;
      vid.play().catch(() => {});
    };
    const arm = () => {
      if (dead) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          shown = entry.isIntersecting && entry.intersectionRatio >= 0.5;
          play();
        },
        { threshold: 0.5 },
      );
      io.observe(el);
      el.dataset.io = "1";
      const stop = () => io.disconnect();
      el.addEventListener("sign-unmount", stop, { once: true });
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    const onVis = () => play();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      dead = true;
      el.dispatchEvent(new Event("sign-unmount"));
      window.removeEventListener("load", arm);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [video]);

  return (
    <div ref={box} className="sign-media">
      <img src={poster} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      <video ref={clip} poster={poster} muted playsInline loop preload="none" />
    </div>
  );
}

const PPF_PRICE: Record<string, string> = {
  front: fullFrontLabel,
  custom: frontPlusLabel,
  max: fullBodyLabel,
};

const PPF_ART: Record<string, string> = {
  front: "/images/kits/cx5-front.jpg",
  custom: "/images/kits/cx5-frontplus.jpg",
  max: "/images/kits/cx5-max.jpg",
};

function PhonePill({ compact = false }: { compact?: boolean }) {
  return (
    <a className={compact ? "phone-pill is-compact" : "phone-pill"} href={site.phoneHref}>
      <Phone size={16} aria-hidden />
      <span>{compact ? site.phone : `Call or text ${site.phone}`}</span>
    </a>
  );
}

function EstimatePill({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link to="/estimate" className={onDark ? "estimate-pill on-dark" : "estimate-pill"}>
      Build your estimate
    </Link>
  );
}

export function Landing() {
  const [ribbon, setRibbon] = useState(seasonCopy.summer.ribbon);
  const [ribbonHref, setRibbonHref] = useState<"/ppf" | null>("/ppf");

  useEffect(() => {
    const forced = seasonFromSearch(window.location.search);
    const season = forced ?? activeSeason();
    setRibbon(seasonCopy[season].ribbon);
    setRibbonHref(season === "fall" || season === "christmas" ? null : "/ppf");
  }, []);

  return (
    <div className="store-page sign-home">
      <p className="store-ribbon">
        {ribbonHref ? (
          <>
            Paint protection. <Link to={ribbonHref}>HARD PP 10 is here.</Link>
          </>
        ) : (
          ribbon
        )}
      </p>

      <section className="sign-hero">
        <div className="sign-hero-panel" aria-hidden />
        <p className="sign-brand">SUPERAF.CA · Calgary, AB · EST. 2016</p>
        <h1>HARD Paint Protection.</h1>
        <p className="sign-lede">
          Paint protection film, window tint and windshield film. Made in-house, installed at 426 Memorial Drive NE.
        </p>
        <p className="sign-cta">
          <PhonePill />
          <EstimatePill onDark />
        </p>
      </section>

      <section className="sign-packages">
        <header className="sign-head">
          <p className="sign-kicker">Packages</p>
          <h2>Pick your protection.</h2>
        </header>
        <div className="sign-grid">
          {packages.map((pack) => (
            <article key={pack.id} className={pack.featured ? "sign-card is-featured" : "sign-card"}>
              <OptImg
                src={PPF_ART[pack.id]}
                alt={`${pack.name} coverage diagram. Not a photo of an install.`}
                width={960}
                height={640}
                sizes="(min-width: 900px) 320px, 90vw"
              />
              <h3>
                {pack.name} <span>from {PPF_PRICE[pack.id]}</span>
              </h3>
              {pack.featured ? <p className="sign-tag">{pack.why}</p> : null}
              <ul>
                {pack.includes.slice(0, 5).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="sign-time">{pack.daysLabel}</p>
              <Link to="/estimate" className="sign-build">
                Build this
              </Link>
            </article>
          ))}
        </div>
        <div className="sign-glass">
          <article className="sign-card is-small">
            <h3>
              Windshield protection film <span>{windshieldFilmLabel}</span>
            </h3>
            <p>Clear or tinted. Sacrificial layer for gravel.</p>
            <Link to="/windshield">Glass protection</Link>
          </article>
          <article className="sign-card is-small">
            <h3>
              Window tint <span>fronts from {tintFrontsLabel}</span>
            </h3>
            <p>Carbon. Ceramic from {tintFrontsCeramicLabel}.</p>
            <Link to="/tint">Tint</Link>
          </article>
          <article className="sign-card is-small">
            <h3>
              Windshield tint <span>from {windshieldTintLabel}</span>
            </h3>
            <p>Carbon. Ceramic {windshieldTintCeramicLabel}. Not the same as protection film.</p>
            <Link to="/estimate">Build your estimate</Link>
          </article>
          <article className="sign-card is-small">
            <h3>
              Sun visor strip <span>from {visorLabel}</span>
            </h3>
            <p>Carbon visor strip.</p>
            <Link to="/estimate">Build your estimate</Link>
          </article>
        </div>
        <p className="sign-fine">{PRICE_GUARANTEE}</p>
      </section>

      <section className="sign-work">
        <header className="sign-head">
          <p className="sign-kicker">The shop</p>
          <h2>Real work.</h2>
        </header>
        <div className="sign-circles">
          <figure>
            <OptImg
              src="/images/work/ppf/ppf-03.jpg"
              alt="Paint protection film being installed on a red Mazda front bumper and headlight, hood open"
              width={640}
              height={640}
              sizes="180px"
            />
            <figcaption>
              Paint protection
              <span>Film</span>
            </figcaption>
          </figure>
          <figure>
            <OptImg
              src="/images/windshield-install-02-tuck.jpg"
              alt="Film tucked into the windshield edge"
              width={640}
              height={640}
              sizes="180px"
            />
            <figcaption>
              Windshield
              <span>Film</span>
            </figcaption>
          </figure>
          <figure>
            <OptImg
              src="/images/boxes-shop.jpg"
              alt="SUPER A.F. Corporation bay, plotter and boxed film"
              width={640}
              height={640}
              sizes="180px"
            />
            <figcaption>
              HARD PP
              <span>Made in-house</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="sign-film">
        <header className="sign-head">
          <p className="sign-kicker">The film</p>
          <h2>We don't buy film. We make it.</h2>
        </header>
        <p className="sign-lede-ink">Hydrophobic. Anti-Yellowing. Repairing. Durable.</p>
        <p className="sign-years">5YR and 10YR. Clear on both. Matte, satin and colour on 10YR.</p>
        <FilmMedia
          poster="/images/hydrophobic-poster.jpg"
          video="/videos/hydrophobic-loop-sm.mp4"
          alt="Water beading on hydrophobic paint protection film"
          width={1280}
          height={720}
        />
        <p className="sign-links">
          <Link to="/ppf">Learn more</Link>
        </p>
      </section>

      <section className="sign-stats">
        <LiveStats items={proofStats} />
      </section>

      <section className="sign-reviews">
        <GoogleReviews />
      </section>

      <section className="sign-steps">
        <header className="sign-head">
          <p className="sign-kicker">Windshield film</p>
          <h2>Lay. Tuck. Trim. Done.</h2>
        </header>
        <div className="store-install">
          {[
            ["/images/windshield-install-01-lay.jpg", "Lay", "Windshield film laid wet across the glass"],
            ["/images/windshield-install-02-tuck.jpg", "Tuck", "Film tucked into the windshield edge"],
            ["/images/windshield-install-03-trim.jpg", "Trim", "Knife trimming windshield film to the glass"],
            ["/images/windshield-install-04-done.jpg", "Done", "Finished white Lexus with windshield film, downtown Calgary"],
          ].map(([src, cap, alt]) => (
            <figure key={cap}>
              <OptImg src={src} alt={alt} width={960} height={640} sizes="(min-width: 768px) 22vw, 70vw" />
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="sign-visit">
        <h2>
          <AddressLink>426 Memorial Drive NE.</AddressLink>
        </h2>
        <p>
          {site.hours}. Text or call {site.phone}. {site.hoursNote}
        </p>
        <p className="sign-cta">
          <PhonePill />
          <a className="estimate-pill" href={site.maps} target="_blank" rel="noopener noreferrer">
            Directions
          </a>
        </p>
        <div className="store-map">
          <iframe
            src={site.mapsEmbed}
            loading="lazy"
            title="SUPERAF.CA on Google Maps"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
