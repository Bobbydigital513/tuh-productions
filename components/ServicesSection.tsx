"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { company } from "@/lib/company";

export default function ServicesSection() {
  const { ref, inView } = useScrollReveal(0.15);

  return (
    <section id="services" className="bg-[#0a0a0a] py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-6 transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <p className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-tuh-cyan">
          What We Do
        </p>
        <h2 className="mt-3 text-center font-display text-4xl text-white sm:text-5xl">
          Studio Services
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {company.services.map((service, i) => (
            <div
              key={service}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-tuh-cyan/50 hover:bg-white/[0.06]"
            >
              <span className="font-display text-2xl text-tuh-magenta">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">{service}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
