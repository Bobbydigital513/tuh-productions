"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { company } from "@/lib/company";

export default function AboutSection() {
  const { ref, inView } = useScrollReveal(0.2);

  return (
    <section id="about" className="border-t border-white/10 bg-[#0a0a0a] py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl px-6 text-center transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
          Based in {company.location}
        </p>
        <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
          From the booth to the skyline.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          {company.name} brings major-label polish to every record — clean recordings,
          punchy mixes, and masters built to hit on any system. Whether you&apos;re cutting
          your first single or finishing an album, we engineer the sound that gets you heard.
        </p>
      </div>
    </section>
  );
}
