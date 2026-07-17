import type { TerrainProfile } from "@/types/terrain";

export default function SynthesisCard({
  data,
  onGenerate,
}: {
  data: TerrainProfile;
  onGenerate: () => void;
}) {
  const loc = data.localisation ?? ({} as Partial<TerrainProfile["localisation"]>);
  const ter = data.terrain ?? ({} as Partial<TerrainProfile["terrain"]>);
  const con = data.contraintes ?? ({} as Partial<TerrainProfile["contraintes"]>);
  const vis = data.vision ?? ({} as Partial<TerrainProfile["vision"]>);
  const pro = data.profil ?? ({} as Partial<TerrainProfile["profil"]>);

  const rows: [string, string | undefined][] = [
    ["Sol", ter.sol_texture],
    ["Superficie", ter.superficie_m2 ? `${ter.superficie_m2}m²` : undefined],
    ["Drainage", ter.sol_drainage],
    ["Lumière", ter.ensoleillement],
    ["Zone", loc.zone_rusticite],
    ["Région", loc.region],
    ["Budget", con.budget_estime],
    ["Délai", con.delai_projet],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <div className="my-2 overflow-hidden rounded-2xl border-2 border-fern bg-white">
      <div className="bg-forest px-3.5 py-3">
        <div className="font-display text-base font-bold text-cream">
          📋 Analyse de site complète
        </div>
        <div className="font-mono mt-0.5 text-[10px] text-fern">
          {pro.prenom ? `Projet de ${pro.prenom} · ` : ""}
          {loc.region || "Votre terrain"} · Zone {loc.zone_rusticite || "3"}
        </div>
      </div>
      <div className="p-3">
        <div className="mb-2.5 grid grid-cols-2 gap-1.5">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-cream px-2 py-1.5">
              <div className="font-mono text-[9px] text-slate">{label}</div>
              <div className="font-sans text-xs font-semibold text-charcoal">{value}</div>
            </div>
          ))}
        </div>
        {vis.priorites && vis.priorites.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1">
            {vis.priorites.map((pr) => (
              <span
                key={pr}
                className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent"
              >
                {pr}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={onGenerate}
          className="font-sans w-full rounded-xl bg-forest py-3 text-sm font-bold text-white"
        >
          🌿 Générer ma guilde sur-mesure
        </button>
      </div>
    </div>
  );
}
