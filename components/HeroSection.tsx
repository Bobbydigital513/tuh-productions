"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { company } from "@/lib/company";

const NOTES = ["♪", "♫", "♬"];

// One octave: C D E F G A B (white), with black keys after C, D, F, G, A.
const OCTAVE_WHITE = 7;
const BLACK_AFTER = new Set([0, 1, 3, 4, 5]);
const NUM_OCTAVES = 3;
const TOTAL_WHITE = OCTAVE_WHITE * NUM_OCTAVES;

function noteField() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    note: NOTES[i % NOTES.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5,
    size: 14 + Math.random() * 20,
    color: i % 2 === 0 ? "#e8e8e8" : "#9a9a9a",
  }));
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [notes, setNotes] = useState<ReturnType<typeof noteField>>([]);

  useEffect(() => {
    setNotes(noteField());
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase boundaries
  const p1End = 0.03;
  const p2Start = 0.05;
  const p2End = 0.32;
  const p3End = 0.36;
  const p4End = 0.55;

  const [rawProgress, setRawProgress] = useState(0);
  useEffect(() => {
    let frameId = 0;
    const update = () => {
      const container = containerRef.current;
      if (container) {
        const total = container.offsetHeight - window.innerHeight;
        const p = total > 0 ? (window.scrollY - container.offsetTop) / total : 0;
        setRawProgress(Math.min(1, Math.max(0, p)));
      }
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const clampMap = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    const t = Math.min(1, Math.max(0, (value - inMin) / (inMax - inMin)));
    return outMin + (outMax - outMin) * t;
  };

  const phase1OpacityRaw = clampMap(rawProgress, 0, p1End, 1, 0);
  const phase1ScaleRaw = clampMap(rawProgress, 0, p1End, 0.82, 1.08);
  const scrollIndicatorOpacityRaw = clampMap(rawProgress, p2Start, p2End, 1, 0);

  const gradeOpacity = useTransform(scrollYProgress, [p2End, p3End], [0, 0.18]);

  const headlineOpacityRaw = clampMap(rawProgress, p3End, p3End + 0.04, 0, 1);
  const headlineYRaw = clampMap(rawProgress, p3End, p3End + 0.04, 40, 0);

  const subOpacityRaw = clampMap(rawProgress, p3End + 0.02, p3End + 0.06, 0, 1);
  const subYRaw = clampMap(rawProgress, p3End + 0.02, p3End + 0.06, 30, 0);

  const dividerWidthRaw = clampMap(rawProgress, p3End + 0.04, p3End + 0.09, 0, 100);

  const taglineOpacityRaw = clampMap(rawProgress, p3End + 0.07, p3End + 0.11, 0, 1);
  const taglineYRaw = clampMap(rawProgress, p3End + 0.07, p3End + 0.11, 24, 0);

  const subTaglineOpacityRaw = clampMap(rawProgress, p3End + 0.1, p3End + 0.14, 0, 1);
  const subTaglineYRaw = clampMap(rawProgress, p3End + 0.1, p3End + 0.14, 20, 0);

  const ctaOpacityRaw = clampMap(rawProgress, p3End + 0.13, p3End + 0.18, 0, 1);
  const ctaYRaw = clampMap(rawProgress, p3End + 0.13, p3End + 0.18, 16, 0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frameId = 0;
    const sync = () => {
      const progress = scrollYProgress.get();
      if (video.duration && progress >= p2Start) {
        const localProgress = Math.min(
          1,
          Math.max(0, (progress - p2Start) / (p4End - p2Start)),
        );
        const targetTime = localProgress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.03) {
          video.currentTime = targetTime;
        }
      }
      frameId = requestAnimationFrame(sync);
    };
    frameId = requestAnimationFrame(sync);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [scrollYProgress, p2Start, p4End]);

  // Each piano key lifts away in a left-to-right glissando sweep, timed by its x position.
  const sweepRange = p2End - p2Start;
  const liftDuration = sweepRange / 4;
  const liftAt = (fraction: number) => {
    const start = p2Start + fraction * (sweepRange - liftDuration);
    const end = start + liftDuration;
    return clampMap(rawProgress, start, end, 0, 1);
  };

  const whiteKeys = Array.from({ length: TOTAL_WHITE }, (_, i) => {
    const fraction = i / (TOTAL_WHITE - 1);
    return { lift: liftAt(fraction) };
  });

  const blackKeys: { leftPercent: number; widthPercent: number; lift: number }[] = [];
  const whiteKeyWidthPercent = 100 / TOTAL_WHITE;
  for (let o = 0; o < NUM_OCTAVES; o++) {
    for (let w = 0; w < OCTAVE_WHITE; w++) {
      if (!BLACK_AFTER.has(w)) continue;
      const whiteIndex = o * OCTAVE_WHITE + w;
      const boundaryPercent = (whiteIndex + 1) * whiteKeyWidthPercent;
      const widthPercent = whiteKeyWidthPercent * 0.62;
      const fraction = boundaryPercent / 100;
      blackKeys.push({
        leftPercent: boundaryPercent - widthPercent / 2,
        widthPercent,
        lift: liftAt(fraction),
      });
    }
  }

  return (
    <section ref={containerRef} className="relative h-[320vh] bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* faint piano key strip texture along the bottom edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-24 opacity-[0.05]">
          {Array.from({ length: 36 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 border-r border-white/30 ${i % 2 === 0 ? "bg-white" : "bg-transparent"}`}
            />
          ))}
        </div>

        {/* video layer, revealed behind the lifting piano keys */}
        <div className="absolute inset-0 z-10 bg-[#0c0c0e]">
          <video
            ref={videoRef}
            src={company.heroVideoUrl}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* night color grade */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(160deg, #2a2a2a 0%, #050505 100%)",
              mixBlendMode: "overlay",
              opacity: gradeOpacity,
            }}
          />
          {/* vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 35%, rgba(10,10,10,0.9) 100%)",
            }}
          />
        </div>

        {/* piano key reveal: keys flip up and away, exposing the video underneath */}
        <div
          className="absolute inset-0 z-20 flex"
          style={{ perspective: "1400px" }}
        >
          {whiteKeys.map((key, i) => (
            <div
              key={i}
              className="relative h-full flex-1 origin-top border-r border-black/30"
              style={{
                background:
                  "linear-gradient(180deg, #ffffff 0%, #f5f5f0 78%, #ddddd6 100%)",
                transform: `rotateX(${key.lift * -110}deg) translateY(${key.lift * -4}%)`,
                opacity: 1 - key.lift,
                boxShadow:
                  key.lift > 0 && key.lift < 1
                    ? "0 30px 40px -10px rgba(0,0,0,0.6)"
                    : "inset 0 -10px 14px -8px rgba(0,0,0,0.25)",
                transformStyle: "preserve-3d",
              }}
            />
          ))}
        </div>

        {/* black keys, shorter and overlapping the white key boundaries */}
        <div className="absolute inset-0 z-[21]" style={{ perspective: "1400px" }}>
          {blackKeys.map((key, i) => (
            <div
              key={i}
              className="absolute top-0 h-[62%] origin-top rounded-b-sm"
              style={{
                left: `${key.leftPercent}%`,
                width: `${key.widthPercent}%`,
                background: "linear-gradient(180deg, #1a1a1a 0%, #050505 85%)",
                transform: `rotateX(${key.lift * -110}deg) translateY(${key.lift * -4}%)`,
                opacity: 1 - key.lift,
                boxShadow:
                  key.lift > 0 && key.lift < 1
                    ? "0 24px 30px -10px rgba(0,0,0,0.7)"
                    : "0 2px 4px rgba(0,0,0,0.5)",
                transformStyle: "preserve-3d",
              }}
            />
          ))}
        </div>

        {/* floating music notes */}
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          {notes.map((n) => (
            <span
              key={n.id}
              className="absolute bottom-0 font-bold"
              style={{
                left: n.left,
                fontSize: n.size,
                color: n.color,
                textShadow: `0 0 12px ${n.color}`,
                animation: `note-drift ${n.duration}s ease-in ${n.delay}s infinite`,
              }}
            >
              {n.note}
            </span>
          ))}
        </div>

        {/* film grain */}
        <div
          className="pointer-events-none absolute inset-0 z-40 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
            animation: "grain 1.2s steps(4) infinite",
          }}
        />

        {/* Phase 1: TUH logo mark */}
        <div
          className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{ opacity: phase1OpacityRaw }}
        >
          <div
            style={{
              transform: `scale(${phase1ScaleRaw})`,
              filter:
                "drop-shadow(0 14px 30px rgba(0,0,0,0.7)) drop-shadow(0 0 70px rgba(255,255,255,0.35))",
            }}
          >
            <Image
              src={company.logoUrl}
              alt="TUH Productions"
              width={460}
              height={460}
              priority
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-28 left-0 right-0 z-50 flex flex-col items-center gap-3"
          style={{ opacity: scrollIndicatorOpacityRaw }}
        >
          <span className="h-10 w-px bg-white/40" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
            Scroll
          </span>
          <motion.span
            className="text-white/50"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </div>

        {/* dark backdrop behind hero copy for legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-[45] flex items-center justify-center"
          style={{ opacity: headlineOpacityRaw }}
        >
          <div
            className="h-[560px] w-[820px] max-w-[90vw] rounded-[50%]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0) 75%)",
            }}
          />
        </div>

        {/* Phase 4: hero copy */}
        <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center">
          <div
            style={{
              opacity: headlineOpacityRaw,
              transform: `translateY(${headlineYRaw}px)`,
              filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.85)) drop-shadow(0 1px 6px rgba(0,0,0,0.9))",
            }}
          >
            <Image
              src={company.logoUrl}
              alt="TUH Productions"
              width={220}
              height={220}
              className="w-40 sm:w-56 md:w-64"
            />
          </div>
          <p
            style={{
              opacity: subOpacityRaw,
              transform: `translateY(${subYRaw}px)`,
              textShadow: "0 1px 12px rgba(0,0,0,0.9)",
            }}
            className="mt-2 text-sm font-semibold uppercase tracking-[0.4em] text-white/80"
          >
            Production &amp; Engineering
          </p>

          <span
            style={{
              width: `${dividerWidthRaw}%`,
              background: "linear-gradient(90deg, #ffffff, #888888)",
            }}
            className="mt-6 h-px max-w-xs"
          />

          <h2
            style={{
              opacity: taglineOpacityRaw,
              transform: `translateY(${taglineYRaw}px)`,
              textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.95)",
            }}
            className="mt-6 text-3xl font-bold text-[#f5f5f0] sm:text-4xl"
          >
            {company.heroTagline}
          </h2>
          <p
            style={{
              opacity: subTaglineOpacityRaw,
              transform: `translateY(${subTaglineYRaw}px)`,
              textShadow: "0 1px 12px rgba(0,0,0,0.9)",
            }}
            className="mt-2 text-base font-medium uppercase tracking-[0.3em] text-[#f5f5f0]/95"
          >
            {company.heroSubTagline}
          </p>

          <a
            href="#contact"
            style={{
              opacity: ctaOpacityRaw,
              transform: `translateY(${ctaYRaw}px)`,
            }}
            className="pointer-events-auto group mt-10 rounded-full border border-white/70 bg-[#0a0a0a]/40 px-10 py-4 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]"
          >
            {company.heroCta}
          </a>
        </div>
      </div>
    </section>
  );
}
