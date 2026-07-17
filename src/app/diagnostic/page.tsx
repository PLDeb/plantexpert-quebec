import ChatAgent from "@/components/chat/ChatAgent";
import type { ParcoursId } from "@/lib/parcours";

const VALID_PARCOURS: ParcoursId[] = ["debutant", "intermediaire", "expert"];

export default async function DiagnosticPage({
  searchParams,
}: {
  searchParams: Promise<{ parcours?: string }>;
}) {
  const { parcours } = await searchParams;
  const parcoursId: ParcoursId = VALID_PARCOURS.includes(parcours as ParcoursId)
    ? (parcours as ParcoursId)
    : "debutant";

  return <ChatAgent parcours={parcoursId} />;
}
