import GuildCanvas from "./GuildCanvas";
import { plantByName } from "@/lib/plants";
import type { GeneratedGuild } from "@/types/guild";

export default function GuildPlanTab({
  guild,
  superficie,
}: {
  guild: GeneratedGuild;
  superficie: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <GuildCanvas guild={guild} superficie={superficie} />

      <div className="rounded-xl bg-white p-3">
        <div className="font-mono mb-1 text-[10px] text-slate">LOGIQUE SPATIALE</div>
        <p className="font-sans text-sm leading-relaxed text-charcoal">{guild.logique_spatiale}</p>
      </div>

      <div className="rounded-xl bg-white p-3">
        <div className="font-mono mb-2 text-[10px] text-slate">LÉGENDE</div>
        <div className="flex flex-wrap gap-1.5">
          {guild.plantes.map((gp) => {
            const plant = plantByName(gp.nom);
            if (!plant) return null;
            return (
              <div key={gp.nom} className="flex items-center gap-1.5 rounded-md bg-cream px-2 py-1">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: plant.couleur }}
                />
                <span className="font-sans text-xs text-charcoal">
                  {plant.emoji} {gp.nom}
                </span>
                <span className="font-mono text-[10px] text-bark">x{gp.quantite}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
