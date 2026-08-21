"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { company } from "@/lib/company";

export default function MerchSection() {
  const { ref, inView } = useScrollReveal(0.15);

  return (
    <section id="merch" className="border-t border-white/10 bg-[#0a0a0a] py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-6 transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <p className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
          Wear The Sound
        </p>
        <h2 className="mt-3 text-center font-display text-4xl text-white sm:text-5xl">
          Merch
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {company.merch.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#111]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                <p className="mt-1 text-sm text-white/50">{item.price}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/40 transition-colors group-hover:text-white/70">
                  Shop Now →
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
