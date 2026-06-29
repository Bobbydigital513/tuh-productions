"use client";

import { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const PROJECT_TYPES = ["Single", "EP", "Album", "Mixtape"];
const BUDGETS = ["Under $500", "$500 - $1.5k", "$1.5k - $5k", "$5k+"];

export default function SurveySection() {
  const { ref, inView } = useScrollReveal(0.15);
  const [projectType, setProjectType] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  return (
    <section id="survey" className="border-t border-white/10 bg-[#0a0a0a] py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-2xl px-6 transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <p className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
          Tell Us About Your Project
        </p>
        <h2 className="mt-3 text-center font-display text-4xl text-white sm:text-5xl">
          Quick Survey
        </h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-12 space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8"
        >
          <div>
            <label className="text-sm font-medium uppercase tracking-wider text-white/70">
              What are you working on?
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PROJECT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProjectType(type)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    projectType === type
                      ? "border-white bg-white text-[#0a0a0a]"
                      : "border-white/20 text-white/70 hover:border-white/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium uppercase tracking-wider text-white/70">
              Estimated budget
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    budget === b
                      ? "border-white bg-white text-[#0a0a0a]"
                      : "border-white/20 text-white/70 hover:border-white/50"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="survey-notes"
              className="text-sm font-medium uppercase tracking-wider text-white/70"
            >
              Anything else we should know?
            </label>
            <textarea
              id="survey-notes"
              rows={4}
              placeholder="Reference tracks, deadlines, vibe..."
              className="mt-4 w-full rounded-xl border border-white/20 bg-transparent p-4 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full border border-white/70 bg-white py-4 text-sm font-semibold uppercase tracking-wider text-[#0a0a0a] transition-all duration-300 hover:bg-white/90"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
