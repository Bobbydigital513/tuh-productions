"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { company } from "@/lib/company";

export default function ContactSection() {
  const { ref, inView } = useScrollReveal(0.2);

  return (
    <section
      id="contact"
      className="border-t border-white/10 bg-[#0a0a0a] py-28"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-2xl px-6 text-center transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h2 className="font-display text-4xl text-white sm:text-5xl">
          Let&apos;s Make Something.
        </h2>
        <p className="mt-4 text-white/70">
          Studio sessions, mixes, and masters — book your time with {company.name}.
        </p>
        <a
          href={`mailto:${company.email}`}
          className="mt-10 inline-block rounded-full border border-tuh-cyan px-10 py-4 text-sm font-semibold uppercase tracking-wider text-tuh-cyan transition-all duration-300 hover:bg-tuh-cyan hover:text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(52,227,255,0.5)]"
        >
          {company.email}
        </a>
      </div>
    </section>
  );
}
