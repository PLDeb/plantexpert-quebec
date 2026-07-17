import Link from "next/link";
import type { Parcours } from "@/lib/parcours";

export default function ParcoursCard({ parcours }: { parcours: Parcours }) {
  return (
    <Link
      href={`/diagnostic?parcours=${parcours.id}`}
      className="flex items-start gap-3.5 rounded-2xl border-2 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
      style={{ borderColor: parcours.couleur + "33" }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-2xl"
        style={{
          backgroundColor: parcours.couleur + "22",
          borderColor: parcours.couleur + "55",
        }}
      >
        {parcours.emoji}
      </div>
      <div className="flex-1">
        <div className="font-display text-lg font-bold text-forest">
          {parcours.titre}
        </div>
        <div
          className="font-sans mt-0.5 text-xs font-semibold"
          style={{ color: parcours.couleur }}
        >
          {parcours.niveau} · {parcours.sousTitre}
        </div>
        <p className="font-sans mt-1.5 text-sm leading-relaxed text-slate">
          {parcours.desc}
        </p>
        <div
          className="font-sans mt-2.5 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
          style={{ backgroundColor: parcours.couleur }}
        >
          {parcours.ctaBouton} →
        </div>
      </div>
    </Link>
  );
}
