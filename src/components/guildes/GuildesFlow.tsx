"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GuildSelector from "./GuildSelector";
import GuildView from "./GuildView";
import { DIAGNOSTIC_STORAGE_KEY } from "@/lib/storage";
import type { TerrainProfile } from "@/types/terrain";
import type { GuildTemplate } from "@/types/guild";
import type { ParcoursId } from "@/lib/parcours";

interface StoredDiagnostic {
  terrain: TerrainProfile;
  parcours: ParcoursId;
}

export default function GuildesFlow() {
  const router = useRouter();
  const [data, setData] = useState<StoredDiagnostic | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [templates, setTemplates] = useState<GuildTemplate[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState<"select" | "view">("select");

  useEffect(() => {
    // Lecture de sessionStorage : uniquement possible côté navigateur, donc dans un
    // effet plutôt qu'un état initial paresseux (qui s'exécuterait aussi côté serveur).
    const raw = sessionStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
    let parsed: StoredDiagnostic | null = null;
    if (raw) {
      try {
        parsed = JSON.parse(raw) as StoredDiagnostic;
      } catch {
        parsed = null;
      }
    }
    // Lecture unique et synchrone d'un stockage navigateur au montage (pas un état
    // dérivé de props) : pas d'alternative à setState ici.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (parsed) {
      setData(parsed);
    } else {
      setNotFound(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <div className="text-4xl">🌿</div>
        <div className="font-display text-lg text-forest">Aucun diagnostic trouvé</div>
        <p className="font-sans max-w-xs text-sm text-slate">
          Il faut d&apos;abord compléter le diagnostic avec Sylvie avant de générer une guilde.
        </p>
        <Link
          href="/"
          className="font-sans rounded-xl bg-forest px-5 py-2.5 text-sm font-bold text-white"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const superficie = data.terrain?.terrain?.superficie_m2 || 500;

  if (step === "select") {
    return (
      <GuildSelector
        terrain={data.terrain}
        superficie={superficie}
        onBack={() => router.push("/diagnostic")}
        onConfirm={(tpls) => {
          setTemplates(tpls);
          setActiveIndex(0);
          setStep("view");
        }}
      />
    );
  }

  const current = templates[activeIndex] ?? null;

  return (
    <div className="min-h-screen bg-cream">
      {templates.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto bg-forest px-2.5 pt-2">
          {templates.map((tpl, idx) => (
            <button
              key={tpl.id}
              onClick={() => setActiveIndex(idx)}
              className={`font-sans shrink-0 whitespace-nowrap rounded-t-lg px-3 py-2 text-xs ${
                idx === activeIndex ? "bg-cream font-bold text-forest" : "bg-white/10 text-mist"
              }`}
            >
              {tpl.emoji} {tpl.nom}
            </button>
          ))}
        </div>
      )}
      <GuildView
        key={current?.id ?? "single"}
        terrain={data.terrain}
        superficie={superficie}
        template={current}
        parcoursId={data.parcours}
        onBack={() => setStep("select")}
      />
    </div>
  );
}
