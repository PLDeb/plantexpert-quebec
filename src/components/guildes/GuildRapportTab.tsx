import { estimateCosts } from "@/lib/costs";
import { PARCOURS, type ParcoursId } from "@/lib/parcours";
import type { GeneratedGuild } from "@/types/guild";

export default function GuildRapportTab({
  guild,
  superficie,
  parcoursId,
}: {
  guild: GeneratedGuild;
  superficie: number;
  parcoursId: ParcoursId;
}) {
  const costs = estimateCosts(guild, superficie);
  const parcours = PARCOURS[parcoursId];
  const lines: [string, number][] = [
    [`Végétaux (${guild.plantes.length} espèces)`, costs.plantes],
    [`Préparation & plantation (${superficie}m²)`, costs.labor],
    ["Conception & plan", costs.design],
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-white p-3.5">
        <div className="font-mono mb-2.5 text-[10px] text-slate">
          ESTIMATION BUDGÉTAIRE INDICATIVE
        </div>
        {lines.map(([label, value]) => (
          <div key={label} className="flex justify-between border-b border-sand py-1.5">
            <span className="font-sans text-sm text-charcoal">{label}</span>
            <span className="font-mono text-sm font-bold text-bark">{value} $</span>
          </div>
        ))}
        <div className="mt-2.5 rounded-lg bg-moss p-3 text-center">
          <div className="font-mono mb-0.5 text-[10px] text-mist">ESTIMATION TOTALE</div>
          <div className="font-display text-xl font-bold text-white">
            {costs.min} $ – {costs.max} $
          </div>
        </div>
        <div className="font-sans mt-2 text-[10px] italic leading-relaxed text-slate">
          Estimation préliminaire. Un devis précis sera établi après une visite gratuite du
          terrain.
        </div>
      </div>

      {guild.synergies_cles?.length > 0 && (
        <div className="rounded-xl bg-white p-3.5">
          <div className="font-mono mb-2.5 text-[10px] text-slate">SYNERGIES CLÉS</div>
          {guild.synergies_cles.map((syn, i) => (
            <div key={i} className="flex gap-2 border-b border-sand py-2 last:border-0">
              <span className="shrink-0">✅</span>
              <span className="font-sans text-sm leading-relaxed text-charcoal">{syn}</span>
            </div>
          ))}
        </div>
      )}

      {guild.points_attention?.length > 0 && (
        <div className="rounded-xl bg-white p-3.5">
          <div className="font-mono mb-2.5 text-[10px] text-slate">POINTS D&apos;ATTENTION</div>
          {guild.points_attention.map((pt, i) => (
            <div key={i} className="flex gap-2 border-b border-sand py-2 last:border-0">
              <span className="shrink-0">⚠️</span>
              <span className="font-sans text-sm leading-relaxed text-charcoal">{pt}</span>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl p-4" style={{ background: parcours.couleur }}>
        <div className="mb-2 flex items-center gap-2.5">
          <span className="text-2xl">{parcours.emoji}</span>
          <div>
            <div className="font-mono text-[10px] text-white/70">
              PARCOURS {parcours.niveau.toUpperCase()}
            </div>
            <div className="font-display text-base font-bold text-white">{parcours.ctaTitre}</div>
          </div>
        </div>
        <div className="font-sans mb-3 text-xs leading-relaxed text-white/85">{parcours.ctaDesc}</div>
        {parcours.ctaSecondaire && (
          <div className="mb-3 flex flex-col gap-1.5">
            {parcours.ctaSecondaire.map((svc) => (
              <div key={svc} className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2">
                <span className="text-white">✓</span>
                <span className="font-sans text-xs font-medium text-white">{svc}</span>
              </div>
            ))}
          </div>
        )}
        <div
          className="font-sans rounded-xl bg-white px-3.5 py-3 text-center text-sm font-bold"
          style={{ color: parcours.couleur }}
        >
          {parcours.ctaBouton}
        </div>
        <div className="font-sans mt-2 text-center text-[10px] text-white/70">
          Prise de contact réelle à brancher plus tard (formulaire ou rendez-vous)
        </div>
      </div>
    </div>
  );
}
