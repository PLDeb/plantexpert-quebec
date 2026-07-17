import ParcoursCard from "@/components/ParcoursCard";
import { PARCOURS_LIST } from "@/lib/parcours";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-cream">
      <header className="bg-forest px-5 pt-12 pb-8 text-center">
        <div className="text-5xl">🌿</div>
        <h1 className="font-display mt-2 text-3xl font-bold leading-tight text-cream">
          Aménagez votre terrain
        </h1>
        <p className="font-sans mx-auto mt-3 max-w-xs text-sm leading-relaxed text-mist">
          Choisissez votre parcours. Sylvie, notre conseillère, s&apos;adapte
          à votre niveau et vos besoins.
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-3.5 px-4 py-6">
        <div className="font-mono text-center text-xs tracking-wide text-slate">
          QUI ÊTES-VOUS ?
        </div>

        {PARCOURS_LIST.map((parcours) => (
          <ParcoursCard key={parcours.id} parcours={parcours} />
        ))}

        <p className="font-sans mt-1 text-center text-xs text-mist">
          Gratuit · Sans inscription · Vous repartez avec votre plan
        </p>
      </main>
    </div>
  );
}
