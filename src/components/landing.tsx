import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { site, proofStats } from "@/lib/site";
import { LiveStats } from "@/components/live-stat";
import { founderShots, PhotoCarousel } from "@/components/work-media";
import { AddressLink } from "@/components/sections";
import { GoogleReviews } from "@/components/google-reviews";
import { OptImg } from "@/components/opt-img";
import { activeSeason, seasonCopy, seasonFromSearch } from "@/lib/season";
import { PRICE_GUARANTEE, fullBodyLabel, fullFrontLabel, windshieldFilmLabel } from "@/lib/price-anchors";
import { cn } from "@/lib/utils";

function canPlayMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "3g") return false;
  return true;
}

function Media({
  poster,
  video,
  alt,
  auto,
  portrait,
  priority,
  width,
  height,
}: {
  poster: string;
  video?: string;
  alt: string;
  auto?: boolean;
  portrait?: boolean;
  priority?: boolean;
  width: number;
  height: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>();

  useEffect(() => {
    if (!video) return;
    let dead = false;
    const attach = () => {
      if (dead || !canPlayMotion()) return;
      setSrc(video);
    };
    if (auto) {
      const run = () => {
        const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 250));
        idle(() => attach());
      };
      if (document.readyState === "complete") run();
      else window.addEventListener("load", run, { once: true });
      return () => {
        dead = true;
        window.removeEventListener("load", run);
      };
    }
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          attach();
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      dead = true;
      io.disconnect();
    };
  }, [video, auto]);

  useEffect(() => {
    if (!src) return;
    clip.current?.play().catch(() => {});
  }, [src]);

  return (
    <div ref={box} className={cn("store-media", portrait && "store-media-portrait")}>
      <img
        src={poster}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
      {video ? <video ref={clip} src={src} poster={poster} muted loop playsInline preload="none" /> : null}
    </div>
  );
}

const KIT_ROLL = [
  {
    name: "FRONT",
    line: "The package you love.",
    frames: ["/images/kits/model3-front.jpg", "/images/kits/f150-front.jpg", "/images/kits/cx5-front.jpg"],
  },
  {
    name: "FRONT+",
    line: "The package with sides.",
    frames: ["/images/kits/model3-frontplus.jpg", "/images/kits/f150-frontplus.jpg", "/images/kits/cx5-frontplus.jpg"],
  },
  {
    name: "MAX",
    line: "The all you can eat buffet, calorie free.",
    frames: ["/images/kits/model3-max.jpg", "/images/kits/f150-max.jpg", "/images/kits/cx5-max.jpg"],
  },
] as const;

function KitRoll() {
  const [index, setIndex] = useState(0);
  const [lit, setLit] = useState(true);
  const [seen, setSeen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    let dead = false;
    let timer = 0;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    void (async () => {
      while (!dead) {
        await wait(5000);
        if (dead) return;
        setLit(false);
        await wait(2000);
        if (dead) return;
        setIndex((n) => (n + 1) % 3);
        setLit(true);
      }
    })();
    return () => {
      dead = true;
      window.clearTimeout(timer);
    };
  }, [seen]);

  return (
    <div className="store-kits" ref={root}>
      {KIT_ROLL.map((kit) => (
        <Link key={kit.name} to="/estimate" className="store-kit">
          <span className="store-kit-frame">
            {kit.frames.map((src, i) =>
              i > 0 && !seen ? null : (
                <OptImg
                  key={src}
                  src={src}
                  alt=""
                  width={960}
                  height={640}
                  className={lit && i === index ? "is-on" : undefined}
                />
              ),
            )}
          </span>
          <p className="store-kit-name">{kit.name}</p>
          <p>{kit.line}</p>
        </Link>
      ))}
    </div>
  );
}

function Links({
  learn,
  buy = "/estimate",
}: {
  learn?: "/ppf" | "/windshield" | "/tint" | "/vision";
  buy?: "/estimate";
}) {
  return (
    <p className="store-links">
      {learn ? (
        <Link to={learn} className="store-link">
          Learn more
        </Link>
      ) : null}
      {learn ? <span className="store-link-dot" aria-hidden /> : null}
      <Link to={buy} className="store-link">
        Estimate
      </Link>
    </p>
  );
}

function Module({
  kicker,
  title,
  lede,
  learn,
  poster,
  video,
  alt,
  hero,
  auto,
  portrait,
  tone,
  caption,
  extra,
  children,
}: {
  kicker?: string;
  title: ReactNode;
  lede: ReactNode;
  learn?: "/ppf" | "/windshield" | "/tint" | "/vision";
  poster?: string;
  video?: string;
  alt?: string;
  hero?: boolean;
  auto?: boolean;
  portrait?: boolean;
  tone?: string;
  caption?: string;
  extra?: ReactNode;
  children?: ReactNode;
}) {
  const Title = hero ? "h1" : "h2";
  return (
    <section className={cn("store-mod", hero && "store-hero", tone)}>
      <div className="store-copy">
        {kicker ? <p className="store-kicker">{kicker}</p> : null}
        <Title>{title}</Title>
        <p className="store-lede">{lede}</p>
        <Links learn={learn} />
        {extra}
      </div>
      {poster && video ? (
        <Media
          poster={poster}
          video={video}
          alt={alt ?? ""}
          auto={hero || auto}
          portrait={portrait}
          priority={hero}
          width={hero ? 1280 : 1280}
          height={hero ? 520 : 720}
        />
      ) : poster ? (
        <div className={cn("store-media", portrait && "store-media-portrait")}>
          <OptImg src={poster} alt={alt ?? ""} width={1280} height={720} sizes="(min-width: 900px) 960px, 100vw" />
        </div>
      ) : null}
      {caption ? <p className="store-caption">{caption}</p> : null}
      {children}
    </section>
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
    <div className="store-page">
      <p className="store-ribbon">
        {ribbonHref ? (
          <>
            Paint protection. <Link to={ribbonHref}>HARD PP 10 is here.</Link>
          </>
        ) : (
          ribbon
        )}
      </p>

      <section className="store-mod store-hero">
        <div className="store-copy">
          <h1>
            HARD
            <br />
            Paint Protection.
          </h1>
          <p className="price-row">
            <span>Full front from {fullFrontLabel}</span>
            <span>Full body from {fullBodyLabel}</span>
            <span>Windshield film {windshieldFilmLabel}</span>
          </p>
          <p className="hero-cta">
            <Link to="/estimate" className="hero-build">
              Build your estimate
            </Link>
            <a href={site.phoneHref}>Call {site.phone}</a>
          </p>
          <p className="hero-fine">{PRICE_GUARANTEE}</p>
          <p className="store-lede">Hydrophobic. Anti-Yellowing. Repairing. Durable.</p>
        </div>
        <Media
          poster="/images/hero-box-poster.jpg?v=2"
          video="/videos/hero-box-loop-sm.mp4"
          alt="HARD PP box"
          auto
          priority
          width={1280}
          height={520}
        />
        <LiveStats items={proofStats} />
      </section>

      <GoogleReviews />

      <Module
        tone="store-mod-pp"
        title="Water hates it."
        lede="Water and dirt bead up and roll off, so the car stays cleaner and is easier to wash."
        learn="/ppf"
        poster="/images/hydrophobic-poster.jpg"
        video="/videos/hydrophobic-loop-sm.mp4"
        alt="Water beading on hydrophobic paint protection film"
      />

      <section className="store-mod store-mod-kits">
        <div className="store-copy">
          <h2>FRONT — FRONT+ — MAX</h2>
          <p className="store-lede">Level up your protection, and your life.</p>
          <Links learn="/ppf" />
        </div>
        <KitRoll />
      </section>

      <Module
        tone="store-mod-view"
        title="Windshield film."
        lede={<>Sacrificial layer for Deerfoot gravel. Clear or tinted. {windshieldFilmLabel}.</>}
        learn="/windshield"
        poster="/images/windshield-install-03-trim.jpg"
        alt="Trimming windshield film along the glass edge"
      >
        <div className="store-install">
          {[
            {
              src: "/images/windshield-install-01-lay.jpg",
              cap: "Lay",
              alt: "Windshield film laid wet across the glass",
            },
            {
              src: "/images/windshield-install-02-tuck.jpg",
              cap: "Tuck",
              alt: "Film tucked into the windshield edge",
            },
            {
              src: "/images/windshield-install-03-trim.jpg",
              cap: "Trim",
              alt: "Knife trimming windshield film to the glass",
            },
            {
              src: "/images/windshield-install-04-done.jpg",
              cap: "Done",
              alt: "Finished white Lexus with windshield film, downtown Calgary",
            },
          ].map((shot) => (
            <figure key={shot.cap}>
              <OptImg src={shot.src} alt={shot.alt} width={960} height={640} sizes="(min-width: 768px) 22vw, 70vw" />
              <figcaption>{shot.cap}</figcaption>
            </figure>
          ))}
        </div>
      </Module>

      <section className="store-mod store-mod-founder">
        <div className="store-copy">
          <h2>
            Quality.
            <br />
            Speed. Price.
          </h2>
          <p className="store-lede">Refuse to choose two.</p>
          <Links learn="/vision" />
        </div>
        <PhotoCarousel shots={founderShots} label="The shop" />
      </section>

      <section className="store-mod store-visit">
        <div className="store-copy">
          <h2>
            <AddressLink>426 Memorial Drive NE.</AddressLink>
          </h2>
          <p className="store-lede">
            {site.hours}. Text or call {site.phone}. {site.hoursNote}
          </p>
          <p className="store-links">
            <a className="store-link" href={site.maps} target="_blank" rel="noopener noreferrer">
              Directions
            </a>
            <span className="store-link-dot" aria-hidden />
            <a className="store-link" href={site.phoneHref}>
              Call
            </a>
          </p>
        </div>
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
