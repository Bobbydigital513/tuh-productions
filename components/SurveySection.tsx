"use client";

import { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

const PROJECT_TYPES = ["Single", "EP", "Album", "Mixtape"];
const BUDGETS = ["Under $500", "$500 - $1.5k", "$1.5k - $5k", "$5k+"];

export default function SurveySection() {
  const { ref, inView } = useScrollReveal(0.15);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim() && email.trim() && budget;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    const WEBHOOK = "https://services.leadconnectorhq.com/hooks/R65BWAtYpLsjo14I3Vii/webhook-trigger/91acf310-30f0-410a-9b79-b227d77310f3";
    try {
      const [firstName, ...rest] = name.trim().split(" ");
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: rest.join(" "),
          email,
          phone,
          projectType,
          budget,
          notes,
          "contact.project_type": projectType,
          "contact.budget": budget,
          "contact.project_notes": notes,
        }),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");

      const url =
        budget === "Under $500"
          ? "https://store.tuhproductions.com/tuh-productions"
          : "https://store.tuhproductions.com/tuh-productions-high-ticket";
      window.open(url, "_blank");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

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
          onSubmit={handleSubmit}
          className="mt-12 space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8"
        >
          {/* Contact info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="survey-name" className="text-sm font-medium uppercase tracking-wider text-white/70">
                Full Name <span className="text-white/40">*</span>
              </label>
              <input
                id="survey-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-3 w-full rounded-xl border border-white/20 bg-transparent p-4 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="survey-email" className="text-sm font-medium uppercase tracking-wider text-white/70">
                Email <span className="text-white/40">*</span>
              </label>
              <input
                id="survey-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-3 w-full rounded-xl border border-white/20 bg-transparent p-4 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="survey-phone" className="text-sm font-medium uppercase tracking-wider text-white/70">
              Phone <span className="text-white/40">(optional)</span>
            </label>
            <input
              id="survey-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="mt-3 w-full rounded-xl border border-white/20 bg-transparent p-4 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
            />
          </div>

          {/* Project type */}
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

          {/* Budget */}
          <div>
            <label className="text-sm font-medium uppercase tracking-wider text-white/70">
              Estimated budget <span className="text-white/40">*</span>
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

          {/* Notes */}
          <div>
            <label htmlFor="survey-notes" className="text-sm font-medium uppercase tracking-wider text-white/70">
              Anything else we should know?
            </label>
            <textarea
              id="survey-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reference tracks, deadlines, vibe..."
              className="mt-4 w-full rounded-xl border border-white/20 bg-transparent p-4 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-full border border-white/70 bg-white py-4 text-sm font-semibold uppercase tracking-wider text-[#0a0a0a] transition-all duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Sending..." : "See Your Options"}
          </button>
        </form>
      </div>
    </section>
  );
}
