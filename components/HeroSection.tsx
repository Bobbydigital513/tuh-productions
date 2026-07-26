"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { company } from "@/lib/company";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const directionRef = useRef<1 | -1>(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frameId = 0;
    const STEP = 1 / 30; // ~30fps scrub speed

    const tick = () => {
      if (!video.paused && !video.ended) {
        frameId = requestAnimationFrame(tick);
        return;
      }
      if (video.duration) {
        const next = video.currentTime + directionRef.current * STEP;
        if (next >= video.duration) {
          video.currentTime = video.duration;
          directionRef.current = -1;
        } else if (next <= 0) {
          video.currentTime = 0;
          directionRef.current = 1;
        } else {
          video.currentTime = next;
        }
      }
      frameId = requestAnimationFrame(tick);
    };

    const onLoaded = () => {
      video.play().catch(() => {
        // autoplay blocked — fall back to manual scrub
        frameId = requestAnimationFrame(tick);
      });

      video.addEventListener("ended", () => {
        directionRef.current = -1;
        frameId = requestAnimationFrame(tick);
      });
    };

    video.addEventListener("loadedmetadata", onLoaded);
    return () => {
      cancelAnimationFrame(frameId);
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  return (
    <section className="relative h-screen bg-[#0a0a0a] overflow-hidden">
      {/* video background */}
      <video
        ref={videoRef}
        src={company.heroVideoUrl}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* dark overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.85) 100%)",
        }}
      />

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(10,10,10,0.7) 100%)",
        }}
      />

      {/* film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
          animation: "grain 1.2s steps(4) infinite",
        }}
      />

      {/* hero copy */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            filter:
              "drop-shadow(0 14px 30px rgba(0,0,0,0.7)) drop-shadow(0 0 70px rgba(255,255,255,0.3))",
          }}
        >
          <Image
            src={company.logoUrl}
            alt="TUH Productions"
            width={280}
            height={280}
            priority
            className="w-44 sm:w-60 md:w-72"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="mt-3 text-sm font-semibold uppercase tracking-[0.4em] text-white/80"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
        >
          Production &amp; Engineering
        </motion.p>

        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-6 block h-px w-40 max-w-xs origin-left"
          style={{ background: "linear-gradient(90deg, #ffffff, #555555)" }}
        />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          className="mt-6 text-3xl font-bold text-[#f5f5f0] sm:text-4xl"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
        >
          {company.heroTagline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: "easeOut" }}
          className="mt-2 text-base font-medium uppercase tracking-[0.3em] text-[#f5f5f0]/90"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
        >
          {company.heroSubTagline}
        </motion.p>

        <motion.a
          href="#survey"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
          className="mt-10 rounded-full border border-white/70 bg-[#0a0a0a]/40 px-10 py-4 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]"
        >
          {company.heroCta}
        </motion.a>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3"
      >
        <span className="h-8 w-px bg-white/40" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
          Scroll
        </span>
        <motion.span
          className="text-white/40"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
