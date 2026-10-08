import { useEffect, useRef, useState } from "react";
import file from "@/data/google-reviews.json";
import { loadLiveReviews } from "@/lib/google-places";
import { reviewPresentation, validateReviewFile } from "@/lib/google-reviews";
import { site } from "@/lib/site";

type Live = Awaited<ReturnType<typeof loadLiveReviews>>;

const parsed = validateReviewFile(file);

function Stars({ count }: { count: number }) {
  return (
    <span className="review-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 16 16" aria-hidden>
          <path d={i < count ? "M8 1.4 9.8 5.8 14.6 6.2 11 9.3 12.1 14 8 11.5 3.9 14 5 9.3 1.4 6.2 6.2 5.8Z" : "M8 1.4 9.8 5.8 14.6 6.2 11 9.3 12.1 14 8 11.5 3.9 14 5 9.3 1.4 6.2 6.2 5.8Z"} fill={i < count ? "currentColor" : "none"} stroke="currentColor" />
        </svg>
      ))}
    </span>
  );
}

function StaticCard() {
  return (
    <section className="review-card">
      <p>New site, same shop. Read or leave a Google review.</p>
      <p className="review-links">
        <a href={site.maps} target="_blank" rel="noopener noreferrer">See all on Google</a>
        <a href={site.googleReview} target="_blank" rel="noopener noreferrer">Leave a review</a>
      </p>
    </section>
  );
}

export function GoogleReviews() {
  const box = useRef<HTMLElement>(null);
  const [live, setLive] = useState<Extract<Live, { ok: true }>["data"] | null>(null);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const json = parsed.ok ? parsed.file : null;
  const jsonReviews = json?.reviews ?? [];

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let dead = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        void loadLiveReviews().then((result) => {
          if (!dead && result.ok) setLive(result.data);
        });
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    const onHide = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      dead = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  const apiCount = live?.reviews.length ?? 0;
  const mode = live ? reviewPresentation(apiCount) : reviewPresentation(jsonReviews.length);
  if (!live && mode === "card") {
    return (
      <section ref={box}>
        <StaticCard />
      </section>
    );
  }
  if (live && mode === "card") {
    return (
      <section ref={box}>
        <StaticCard />
      </section>
    );
  }

  const items = live
    ? live.reviews.map((review) => ({
        key: `${review.name}-${review.when}`,
        name: review.name,
        stars: review.stars,
        text: review.text,
        when: review.when,
        photo: review.photo,
        profile: review.profile,
        mapsUrl: review.mapsUrl,
        live: true as const,
      }))
    : jsonReviews.map((review) => ({
        key: `${review.name}-${review.date}`,
        name: review.name,
        stars: review.stars,
        text: review.text,
        when: review.date,
        photo: null,
        profile: null,
        mapsUrl: site.googleReview,
        live: false as const,
      }));

  const renderItem = (item: (typeof items)[number], copy: string) => (
    <article
      key={`${copy}-${item.key}`}
      className={item.live ? "review-item is-live" : "review-item"}
      aria-hidden={copy === "b" ? true : undefined}
      inert={copy === "b" ? true : undefined}
    >
      <header>
        {item.photo ? <img src={item.photo} alt="" width={32} height={32} loading="lazy" decoding="async" /> : null}
        {item.profile ? (
          <a href={item.profile} target="_blank" rel="noopener noreferrer">{item.name}</a>
        ) : (
          <strong>{item.name}</strong>
        )}
        <Stars count={item.stars} />
      </header>
      <p>{item.text}</p>
      <footer>
        {item.live ? <span>{item.when}</span> : <time dateTime={item.when}>{item.when}</time>}
        <a href={item.mapsUrl ?? site.googleReview} target="_blank" rel="noopener noreferrer">
          {item.live ? "View on Google Maps" : "Read on Google"}
        </a>
      </footer>
    </article>
  );

  return (
    <section ref={box} className={`review-strip${paused || tabHidden ? " is-paused" : ""}`}>
      <header className="review-head">
        <p>
          {live && live.rating != null && live.count != null
            ? `★ ${live.rating} on Google · ${live.count} reviews`
            : json?.rating != null && json.count != null
              ? `★ ${json.rating} on Google · ${json.count} reviews`
              : "Google reviews"}
        </p>
        <p className="review-links">
          <a href={site.maps} target="_blank" rel="noopener noreferrer">See all on Google</a>
          <a href={site.googleReview} target="_blank" rel="noopener noreferrer">Leave a review</a>
          <button type="button" aria-pressed={paused} onClick={() => setPaused((on) => !on)}>
            {paused ? "Play" : "Pause"}
          </button>
        </p>
      </header>
      <div className="review-window">
        <div className="review-track">
          {items.map((item) => renderItem(item, "a"))}
          {items.map((item) => renderItem(item, "b"))}
        </div>
      </div>
      <p className="review-note" translate={live ? "no" : undefined}>
        {live ? "Most relevant reviews from Google Maps." : "All our Google reviews, newest first."}
      </p>
      {live ? <p className="google-attr" translate="no">Google Maps</p> : null}
    </section>
  );
}
