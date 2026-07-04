"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function BeatStarsSection() {
  const { ref, inView } = useScrollReveal(0.15);

  return (
    <section id="beats" className="border-t border-white/10 bg-[#0a0a0a] py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-4xl px-6 transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <p className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
          Fresh Off The Board
        </p>
        <h2 className="mt-3 text-center font-display text-4xl text-white sm:text-5xl">
          Listen To The Beats
        </h2>

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <iframe
            src="https://player.beatstars.com/?storeId=152600"
            title="BeatStars Player"
            width="100%"
            height="800"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            loading="lazy"
            className="w-full"
            style={{ maxWidth: "1024px", height: "800px" }}
          />
        </div>
      </div>
    </section>
  );
}
