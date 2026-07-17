"use client";

import { useState } from "react";
import type { ParcoursId } from "@/lib/parcours";

export default function EmailCaptureForm({
  defaultName,
  parcours,
  terrainProfileId,
}: {
  defaultName?: string;
  parcours: ParcoursId;
  terrainProfileId: string | null;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(defaultName ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  if (status === "done") {
    return (
      <div className="my-1.5 rounded-xl border-2 border-fern bg-[#EAF5EE] p-3.5 text-center">
        <div className="mb-1 text-2xl">✅</div>
        <div className="font-sans text-sm font-bold text-forest">
          Parfait{name ? `, ${name}` : ""} !
        </div>
        <div className="font-sans mt-0.5 text-xs text-slate">
          Analyse envoyée à <strong>{email}</strong>
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    if (!email.includes("@") || status === "saving") return;
    setStatus("saving");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, prenom: name, parcours, terrainProfileId }),
      });
      if (!res.ok) throw new Error("save failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="my-1.5 rounded-xl border-2 border-moss bg-white p-3.5">
      <div className="font-display text-sm font-bold text-forest">
        Recevoir votre analyse par courriel
      </div>
      <div className="font-sans mb-2.5 text-xs text-slate">
        Gratuit · Sans engagement · Rapport PDF inclus
      </div>
      <div className="flex flex-col gap-1.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre prénom"
          className="font-sans rounded-lg border border-mist px-2.5 py-2 text-sm outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="votre@courriel.com"
          className="font-sans rounded-lg border border-mist px-2.5 py-2 text-sm outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={status === "saving"}
          className="font-sans rounded-lg bg-moss px-2.5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {status === "saving" ? "Envoi…" : "Recevoir mon analyse →"}
        </button>
        {status === "error" && (
          <div className="font-sans text-xs text-danger">
            Une erreur est survenue, réessayez.
          </div>
        )}
      </div>
    </div>
  );
}
