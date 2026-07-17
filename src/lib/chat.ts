export interface ChatPhase {
  label: string;
  color: string;
}

export const PHASES: ChatPhase[] = [
  { label: "Profil", color: "#6B9E7A" },
  { label: "Lieu", color: "#4A7A5A" },
  { label: "Terrain", color: "#2D5A3D" },
  { label: "Contraintes", color: "#8B6B4A" },
  { label: "Vision", color: "#C4842A" },
];

export const QUICK_REPLIES: string[][] = [
  ["Chaudière-Appalaches", "Québec (ville)", "Montérégie"],
  ["Moins de 200m²", "200–500m²", "500–1000m²", "Plus de 1000m²"],
  ["Plein soleil", "Mi-ombre", "Ombre"],
  ["Aucun animal", "Chiens", "Poules"],
  ["Comestible", "Biodiversité", "Esthétique", "Tout ça!"],
];

export interface ChatUIMessage {
  role: "user" | "assistant";
  content: string;
  time: string;
}

/** Déduit la phase du diagnostic à partir du nombre de réponses de l'agent. */
export function getPhase(messages: ChatUIMessage[]): number {
  const n = messages.filter((m) => m.role === "assistant").length;
  if (n <= 2) return 0;
  if (n <= 5) return 1;
  if (n <= 9) return 2;
  if (n <= 12) return 3;
  return 4;
}

export function timeNow(): string {
  return new Date().toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });
}
