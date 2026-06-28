"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { company } from "@/lib/company";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-3">
          <Image
            src={company.logoUrl}
            alt="TUH Productions"
            width={36}
            height={36}
            className="rounded-full"
            unoptimized
          />
          <span className="font-display text-lg tracking-wide text-white">
            {company.name.toUpperCase()}
          </span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium uppercase tracking-wider text-white/80 sm:flex">
          <a href="#services" className="transition hover:text-tuh-cyan">
            Services
          </a>
          <a href="#about" className="transition hover:text-tuh-cyan">
            About
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/30 px-5 py-2 transition hover:border-tuh-cyan hover:text-tuh-cyan"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
