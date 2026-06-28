import { company } from "@/lib/company";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 text-center text-xs uppercase tracking-widest text-white/40 sm:flex-row sm:justify-between">
        <span>
          &copy; {new Date().getFullYear()} {company.name}
        </span>
        <span>{company.location}</span>
      </div>
    </footer>
  );
}
