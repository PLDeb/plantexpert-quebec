"use client";

import { useEffect, useState } from "react";
import type { TerrainProfile } from "@/types/terrain";
import type { GeneratedGuild, GuildTemplate } from "@/types/guild";
import type { ParcoursId } from "@/lib/parcours";
import GuildPlanTab from "./GuildPlanTab";
import GuildProfilTab from "./GuildProfilTab";
import GuildListeTab from "./GuildListeTab";
import GuildRapportTab from "./GuildRapportTab";

type TabId = "plan" | "profil" | "liste" | "rapport";

async function fetchGuild(
  terrain: TerrainProfile,
  superficie: number,
  templateId?: string,
): Promise<{ guild: GeneratedGuild; demo: boolean }> {
  const res = await fetch("/api/guilde/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ terrain, superficie, templateId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Erreur HTTP ${res.status}`);
  }
  return { guild: data.guild as GeneratedGuild, demo: Boolean(data.demo) };
}

export default function GuildView({
  terrain,
  superficie,
  template,
  parcoursId,
  onBack,
}: {
  terrain: TerrainProfile;
  superficie: number;
  template: GuildTemplate | null;
  parcoursId: ParcoursId;
  onBack?: () => void;
}) {
  const [guild, setGuild] = useState<GeneratedGuild | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [tab, setTab] = useState<TabId>(parcoursId === "expert" ? "liste" : "plan");

  useEffect(() => {
    // Le parent remonte GuildView avec une nouvelle key à chaque changement de
    // template, donc loading/error repartent déjà de leur valeur initiale ici.
    let cancelled = false;

    fetchGuild(terrain, superficie, template?.id)
      .then(({ guild: g, demo }) => {
        if (cancelled) return;
        setGuild(g);
        setIsDemo(demo);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erreur inconnue.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [terrain, superficie, template]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-6 py-20 text-center">
        <div className="text-5xl">🌿</div>
        <div className="font-display text-lg text-forest">Génération de votre guilde…</div>
        <div className="font-sans max-w-xs text-sm text-slate">
          Sylvie analyse les conditions de votre terrain pour sélectionner les espèces les plus
          adaptées.
        </div>
      </div>
    );
  }

  if (error || !guild) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 py-20 text-center">
        <div className="text-4xl">⚠️</div>
        <div className="font-sans max-w-xs text-sm text-danger">
          {error ?? "Guilde introuvable."}
        </div>
      </div>
    );
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "plan", label: "🗺️ Plan" },
    { id: "profil", label: "🌲 Profil" },
    { id: "liste", label: "📋 Plantes" },
    { id: "rapport", label: "📄 Rapport" },
  ];

  const loc = terrain?.localisation;
  const ter = terrain?.terrain;
  const tags = [ter?.sol_texture ? `Sol ${ter.sol_texture}` : null, ter?.ensoleillement, ter?.sol_drainage].filter(
    (tag): tag is string => Boolean(tag),
  );

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <div className="bg-forest px-3.5 py-3">
        <div className="mb-2 flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-mist"
            >
              ←
            </button>
          )}
          <div className="flex-1">
            <div className="font-display text-lg font-bold leading-tight text-cream">
              {guild.nom}
            </div>
            <div className="font-mono mt-0.5 text-[10px] text-fern">
              {loc?.region || "Votre terrain"} · {superficie}m²
            </div>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-mist"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {isDemo && (
        <div className="font-sans border-b border-accent/30 bg-accent/15 px-3.5 py-2 text-center text-xs font-semibold text-accent">
          🧪 Guilde de démonstration — sans appel à l&apos;IA
        </div>
      )}

      <div className="bg-moss px-3.5 py-3">
        <p className="font-sans mb-2 text-sm leading-relaxed text-cream">{guild.description}</p>
        <div className="rounded-lg bg-black/20 px-2.5 py-2">
          <div className="font-mono mb-0.5 text-[10px] text-fern">ANALYSE DU SITE</div>
          <p className="font-sans text-xs leading-relaxed text-mist">{guild.milieu_analyse}</p>
        </div>
      </div>

      <div className="flex bg-sand">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`font-sans flex-1 py-2.5 text-xs ${
              tab === t.id ? "bg-white font-bold text-forest" : "text-slate"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 px-3.5 py-3.5 pb-10">
        {tab === "plan" && <GuildPlanTab guild={guild} superficie={superficie} />}
        {tab === "profil" && <GuildProfilTab guild={guild} />}
        {tab === "liste" && <GuildListeTab guild={guild} superficie={superficie} />}
        {tab === "rapport" && (
          <GuildRapportTab guild={guild} superficie={superficie} parcoursId={parcoursId} />
        )}
      </div>
    </div>
  );
}
