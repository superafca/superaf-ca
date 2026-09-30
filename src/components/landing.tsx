import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { site } from "@/lib/site";
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
      />

      <Module
        auto
        tone="store-mod-heal"
        title="It heals."
        lede="A little heat. The scratches disappear."
        learn="/ppf"
        poster="/images/heal-poster.jpg?v=2"
        video="/videos/heal-loop.mp4?v=2"
        alt="Heat repairing scratches in paint protection film"
        caption="Dramatized for effect."
      />

      <Module
        auto
        tone="store-mod-pp"
        title="PPF longer."
        lede="Self-healing. Hydrophobic. Rock chip protection. HARD PP 5YR and 10YR."
        learn="/ppf"
        poster="/images/hydrophobic-poster.jpg"
        video="/videos/hydrophobic-loop.mp4"
        alt="Water beading on hydrophobic paint protection film"
      />

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

      <div className="store-split">
        <Module
          auto
          portrait
          tone="store-mod-tint"
          title="Pitch black."
          lede="Windows go dark. Carbon. Ceramic if you want the heat gone."
          learn="/tint"
          poster="/images/store-tint.jpg"
          video="/videos/store-tint.mp4?v=2"
          alt="Car windows darkening to pitch black tint"
        />
        <Module
          tone="store-mod-heart"
          title={
            <>
              Quality.
              <br />
              Speed. Cost.
            </>
          }
          lede="Quality, speed, and honest pricing — we refused to pick two."
          learn="/vision"
          poster="/images/brand-heart-blue.jpg"
          video="/videos/store-heart.mp4"
          alt="Chrome red heart"
        />
      </div>

      <section className="store-mod store-mod-kits">
        <div className="store-copy">
          <h2>FRONT. FRONT+. MAX.</h2>
          <p className="store-lede">Pick a coverage. Tick extras. The number rolls.</p>
          <Links learn="/ppf" />
        </div>
        <div className="store-kits">
          {[
            { name: "FRONT", line: "Full front PPF. The kit people love.", img: "/images/rig-suv-white.png" },
            { name: "FRONT+", line: "FRONT plus the pieces you pick.", img: "/images/rig-sedan-white.png" },
            { name: "MAX", line: "Full body. Every painted exterior panel.", img: "/images/rig-truck-white.png" },
          ].map((k) => (
            <Link key={k.name} to="/estimate" className="store-kit">
              <img src={`${k.img}?v=7`} alt="" />
              <p className="store-kit-name">{k.name}</p>
              <p>{k.line}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="store-mod store-mod-boxed">
        <div className="store-copy">
          <h2>Boxed in Calgary.</h2>
          <p className="store-lede">The film. The bay. The city.</p>
          <Links learn="/ppf" />
        </div>
        <div className="store-work">
          <figure className="store-work-glove">
            <img src="/images/boxes-glove.jpg" alt="HARD PP boxes, WWW.SUPERAF.CA" />
          </figure>
          <figure className="store-work-shop">
            <img src="/images/boxes-shop.jpg" alt="SUPER A.F. Corporation bay, plotter and boxed film" />
          </figure>
          <figure className="store-work-pallet">
            <img src="/images/boxes-pallet.jpg" alt="HARD PP pallet unloaded in downtown Calgary" />
          </figure>
        </div>
      </section>

      <section className="store-mod store-visit">
        <div className="store-copy">
          <h2>426 Memorial Drive NE.</h2>
          <p className="store-lede">
            {site.hours}. Text or call {site.phone}. 500+ vehicles protected in 2026 — through our dealer network and our Calgary bay.
          </p>
          <p className="store-links">
            <a className="store-link" href={site.maps} target="_blank" rel="noreferrer">
              Directions
            </a>
            <span className="store-link-dot" aria-hidden />
            <a className="store-link" href={site.phoneHref}>
              Call
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
