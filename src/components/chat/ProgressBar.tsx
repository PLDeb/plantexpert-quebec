import { PHASES } from "@/lib/chat";

export default function ProgressBar({ phase }: { phase: number }) {
  return (
    <div className="border-b border-white/10 bg-forest px-3.5 py-2.5">
      <div className="flex gap-1">
        {PHASES.map((ph, idx) => (
          <div key={ph.label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="h-1 w-full rounded-full"
              style={{ background: idx <= phase ? ph.color : "rgba(255,255,255,0.15)" }}
            />
            <span
              className="font-mono text-center text-[9px]"
              style={{
                color: idx === phase ? ph.color : "rgba(255,255,255,0.3)",
                fontWeight: idx === phase ? 700 : 400,
              }}
            >
              {ph.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
