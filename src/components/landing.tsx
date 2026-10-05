import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { site, proofStats } from "@/lib/site";
import { LiveStats } from "@/components/live-stat";
import { founderShots, PhotoCarousel } from "@/components/work-media";
import { AddressLink } from "@/components/sections";
import { cn } from "@/lib/utils";

function Media({
  poster,
  video,
  alt,
  auto,
  portrait,
}: {
  poster: string;
  video?: string;
  alt: string;
  auto?: boolean;
  portrait?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = box.current;
    const v = clip.current;
    if (!el || !v || !video) return;
    const play = () => {
      v.play().catch(() => {});
    };
    const stop = () => {
      if (auto) return;
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    };
    if (auto) play();
    el.addEventListener("pointerenter", play);
    el.addEventListener("pointerleave", stop);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else if (!auto) stop();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("pointerenter", play);
      el.removeEventListener("pointerleave", stop);
    };
  }, [video, auto]);

  return (
    <div ref={box} className={cn("store-media", portrait && "store-media-portrait")}>
      <img src={poster} alt={alt} />
      {video ? (
        <video
          ref={clip}
          src={video}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay={auto}
          preload="metadata"
        />
      ) : null}
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

  useEffect(() => {
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
  }, []);

  return (
    <div className="store-kits">
      {KIT_ROLL.map((kit) => (
        <Link key={kit.name} to="/estimate" className="store-kit">
          <span className="store-kit-frame">
            {kit.frames.map((src, i) => (
              <img key={src} src={src} alt="" className={lit && i === index ? "is-on" : undefined} />
            ))}
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
      {poster ? (
        <Media
          poster={poster}
          video={video}
          alt={alt ?? ""}
          auto={hero || auto}
          portrait={portrait}
        />
      ) : null}
      {caption ? <p className="store-caption">{caption}</p> : null}
      {children}
    </section>
  );
}

export function Landing() {
  return (
    <div className="store-page">
      <p className="store-ribbon">
        Paint protection. <Link to="/ppf">HARD PP 10 is here.</Link>
      </p>

      <Module
        hero
        title={
          <>
            HARD
            <br />
            Paint Protection.
          </>
        }
        lede="Hydrophobic. Anti-Yellowing. Repairing. Durable."
        learn="/ppf"
        poster="/images/hero-box-poster.jpg?v=2"
        video="/videos/hero-box-loop.mp4?v=2"
        alt="HARD PP box"
        extra={<LiveStats items={proofStats} />}
      />

      <Module
        auto
        tone="store-mod-pp"
        title="Water hates it."
        lede="Water and dirt bead up and roll off, so the car stays cleaner and is easier to wash."
        learn="/ppf"
        poster="/images/hydrophobic-poster.jpg"
        video="/videos/hydrophobic-loop.mp4"
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
        lede="Sacrificial layer for Deerfoot gravel. Clear or tinted. $269."
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
              <img src={shot.src} alt={shot.alt} />
              <figcaption>{shot.cap}</figcaption>
            </figure>
          ))}
        </div>
      </Module>

      <section className="store-mod store-mod-founder">
        <div className="store-copy">
          <h2>Jesus installs it.</h2>
          <p className="store-lede">Jesus owns SUPERAF and installs the film. {site.installerYears}. {site.established}.</p>
          <p className="store-lede">You talk to the person who cuts it, and the person who puts it on.</p>
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
            {site.hours}. Text or call {site.phone}. {site.carsFilmed} vehicles protected in the last 12 months — through our dealer network and our Calgary bay.
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
