"use client";

import { useEffect, useState } from "react";
import { GUILD_TEMPLATES, templatesForZone } from "@/lib/guilds";
import type { GuildTemplate, GuildRecommendation, GuildRecommendationResponse } from "@/types/guild";
import type { TerrainProfile } from "@/types/terrain";

async function fetchRecommendations(
  terrain: TerrainProfile,
  superficie: number,
): Promise<GuildRecommendationResponse & { demo?: boolean }> {
  const res = await fetch("/api/guilde/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ terrain, superficie }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Erreur HTTP ${res.status}`);
  }
  return data;
}

function templateById(id: string): GuildTemplate | null {
  return GUILD_TEMPLATES.find((t) => t.id === id) ?? null;
}

export default function GuildSelector({
  terrain,
  superficie,
  onConfirm,
  onBack,
}: {
  terrain: TerrainProfile;
  superficie: number;
  onConfirm: (templates: GuildTemplate[]) => void;
  onBack: () => void;
}) {
  const clientZone = terrain?.localisation?.zone_rusticite ?? "3";
  const available = templatesForZone(clientZone);

  const [recs, setRecs] = useState<GuildRecommendation[]>([]);
  const [logique, setLogique] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    fetchRecommendations(terrain, superficie)
      .then((data) => {
        if (cancelled) return;
        setRecs(data.recommandations || []);
        setLogique(data.logique_ensemble || "");
        setIsDemo(Boolean(data.demo));
        const pre: Record<string, boolean> = {};
        (data.recommandations || []).forEach((r) => {
          pre[r.template_id] = true;
        });
        setSelected(pre);
      })
      .catch(() => {
        if (cancelled) return;
        if (available.length > 0) {
          setRecs([
            {
              template_id: available[0].id,
              raison: "Guilde bien adaptée à votre zone.",
              superficie_allouee_m2: superficie,
            },
          ]);
          setSelected({ [available[0].id]: true });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }

  function recFor(id: string): GuildRecommendation | null {
    return recs.find((r) => r.template_id === id) ?? null;
  }

  const selectedIds = Object.keys(selected);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-6 py-20 text-center">
        <div className="text-5xl">🌿</div>
        <div className="font-display text-lg text-forest">Analyse de votre terrain…</div>
        <div className="font-sans max-w-xs text-sm text-slate">
          Sylvie identifie les guildes les mieux adaptées à votre zone et vos objectifs.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <div className="bg-forest px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-mist"
          >
            ←
          </button>
          <div className="flex-1">
            <div className="font-display text-lg font-bold leading-tight text-cream">
              Vos guildes recommandées
            </div>
            <div className="font-mono mt-0.5 text-[10px] text-fern">
              {clientZone ? `Zone ${clientZone}` : ""} · {superficie}m² · {available.length} modèles
              compatibles
            </div>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="font-sans border-b border-accent/30 bg-accent/15 px-3.5 py-2 text-center text-xs font-semibold text-accent">
          🧪 Recommandations de démonstration — sans appel à l&apos;IA
        </div>
      )}

      <div className="mx-auto w-full max-w-xl flex-1 px-3.5 py-4 pb-32">
        {logique && (
          <div className="mb-3.5 rounded-xl bg-moss p-3.5">
            <div className="font-mono mb-1 text-[10px] text-fern">LOGIQUE D&apos;ENSEMBLE</div>
            <p className="font-sans text-sm leading-relaxed text-cream">{logique}</p>
          </div>
        )}

        <div className="font-mono mb-2.5 text-[11px] text-slate">
          SÉLECTIONNEZ VOS GUILDES (ajoutez ou retirez)
        </div>

        {available.map((tpl) => {
          const rec = recFor(tpl.id);
          const isRecommended = Boolean(rec);
          const isSelected = Boolean(selected[tpl.id]);
          return (
            <div
              key={tpl.id}
              onClick={() => toggle(tpl.id)}
              className="mb-2.5 cursor-pointer rounded-2xl border-2 bg-white p-3.5 shadow-sm transition"
              style={{
                borderColor: isSelected ? tpl.couleur : "#EDE8DE",
                boxShadow: isSelected ? `0 4px 14px ${tpl.couleur}33` : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 text-xl"
                  style={{ background: `${tpl.couleur}22`, borderColor: `${tpl.couleur}55` }}
                >
                  {tpl.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-display font-bold text-forest">{tpl.nom}</span>
                    {isRecommended && (
                      <span
                        className="font-mono rounded px-1.5 py-0.5 text-[9px] font-bold text-white"
                        style={{ background: tpl.couleur }}
                      >
                        RECOMMANDÉ
                      </span>
                    )}
                  </div>
                  <div className="font-sans mt-1 text-xs leading-relaxed text-slate">{tpl.desc}</div>
                  {rec?.raison && (
                    <div className="mt-2 rounded-lg bg-cream px-2.5 py-1.5">
                      <span
                        className="font-sans text-[11px] font-semibold"
                        style={{ color: tpl.couleur }}
                      >
                        💡 {rec.raison}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: isSelected ? tpl.couleur : "#B5C9BB",
                    background: isSelected ? tpl.couleur : "white",
                  }}
                >
                  {isSelected && <span className="text-xs font-bold text-white">✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-sand bg-white px-4 py-3 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-xl">
          <button
            onClick={() => {
              if (selectedIds.length === 0) return;
              const templates = selectedIds
                .map(templateById)
                .filter((t): t is GuildTemplate => Boolean(t));
              onConfirm(templates);
            }}
            disabled={selectedIds.length === 0}
            className="font-sans w-full rounded-xl bg-forest py-3.5 text-sm font-bold text-white disabled:bg-mist"
          >
            {selectedIds.length === 0
              ? "Sélectionnez au moins une guilde"
              : `Générer ${selectedIds.length} guilde${selectedIds.length > 1 ? "s" : ""} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
