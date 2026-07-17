import { plantByName, FN_COLORS } from "@/lib/plants";
import type { GeneratedGuild } from "@/types/guild";

export default function GuildListeTab({
  guild,
  superficie,
}: {
  guild: GeneratedGuild;
  superficie: number;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="rounded-xl bg-white p-3">
        <div className="font-mono mb-2 text-[10px] text-slate">LISTE D&apos;ACHAT · {superficie}m²</div>
        {guild.plantes.map((gp, idx) => {
          const priorityColor =
            gp.priorite === "obligatoire"
              ? "bg-moss"
              : gp.priorite === "recommandé"
                ? "bg-fern"
                : "bg-slate";
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 py-1.5 ${
                idx < guild.plantes.length - 1 ? "border-b border-sand" : ""
              }`}
            >
              <span className="text-lg">{plantByName(gp.nom)?.emoji ?? "🌿"}</span>
              <div className="font-sans flex-1 text-sm text-charcoal">{gp.nom}</div>
              <div className="font-mono text-xs font-bold text-bark">x{gp.quantite}</div>
              <span
                className={`font-mono rounded px-1.5 py-0.5 text-[9px] font-bold text-white ${priorityColor}`}
              >
                {gp.priorite}
              </span>
            </div>
          );
        })}
      </div>

      {guild.plantes.map((gp, idx) => {
        const plant = plantByName(gp.nom);
        if (!plant) return null;
        const borderColor =
          gp.priorite === "obligatoire"
            ? "border-moss"
            : gp.priorite === "recommandé"
              ? "border-fern"
              : "border-sand";
        return (
          <div key={idx} className={`rounded-xl border-2 bg-white p-3.5 ${borderColor}`}>
            <div className="mb-2 flex items-start gap-2.5">
              <span className="text-2xl">{plant.emoji}</span>
              <div className="flex-1">
                <div className="font-display font-bold text-forest">{gp.nom}</div>
                <div className="font-sans text-[10px] italic text-slate">
                  {plant.latin} · x{gp.quantite} · {gp.orientation} · {gp.distance}m du centre
                </div>
              </div>
            </div>
            <div className="mb-2 rounded-lg bg-cream px-2.5 py-2">
              <div className="font-mono mb-0.5 text-[10px] text-slate">RÔLE DANS CETTE GUILDE</div>
              <div className="font-sans text-xs leading-relaxed text-charcoal">
                {gp.role_dans_guilde}
              </div>
            </div>
            <div className="font-sans mb-2 text-xs leading-relaxed text-slate">{plant.ecologie}</div>
            <div className="flex flex-wrap gap-1">
              {plant.fonctions.map((fn) => (
                <span
                  key={fn}
                  className="font-mono rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: FN_COLORS[fn] ?? "#5A5A5A" }}
                >
                  {fn}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
