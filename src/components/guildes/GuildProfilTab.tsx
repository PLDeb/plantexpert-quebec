import { STRATES, plantByName } from "@/lib/plants";
import type { GeneratedGuild } from "@/types/guild";

export default function GuildProfilTab({ guild }: { guild: GeneratedGuild }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-white p-3.5">
        <div className="font-sans mb-2.5 text-xs uppercase tracking-wide text-slate">
          Profil · coupe transversale
        </div>
        {STRATES.map((strate, si) => {
          const inStrate = guild.plantes.filter((gp) => plantByName(gp.nom)?.strate === strate.id);
          return (
            <div
              key={strate.id}
              className="flex items-stretch gap-2"
              style={{ minHeight: inStrate.length ? 36 : 24 }}
            >
              <div
                className="w-2.5 opacity-70"
                style={{
                  background: strate.c,
                  borderRadius:
                    si === 0 ? "4px 4px 0 0" : si === STRATES.length - 1 ? "0 0 4px 4px" : 0,
                }}
              />
              <div
                className={`flex flex-1 items-center gap-2 py-0.5 ${
                  si < STRATES.length - 1 ? "border-b border-dashed border-sand" : ""
                }`}
              >
                <span className="font-mono min-w-[90px] text-[9px] text-slate">{strate.label}</span>
                <div className="flex flex-wrap gap-1">
                  {inStrate.map((gp) => {
                    const pl = plantByName(gp.nom);
                    return pl ? (
                      <span key={gp.nom} title={gp.nom} className="text-sm">
                        {pl.emoji}
                      </span>
                    ) : null;
                  })}
                  {inStrate.length === 0 && <span className="text-[10px] italic text-mist">—</span>}
                </div>
              </div>
              <div className="font-mono flex items-center whitespace-nowrap text-[9px] text-mist">
                {strate.h}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-white p-3">
        <div className="font-mono mb-1.5 text-[10px] text-slate">SÉQUENCE DE PLANTATION</div>
        <p className="font-sans text-sm leading-relaxed text-charcoal">{guild.sequence_plantation}</p>
      </div>
    </div>
  );
}
