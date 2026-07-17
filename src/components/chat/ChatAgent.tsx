"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PARCOURS, type ParcoursId } from "@/lib/parcours";
import { extractSynthese, stripSynthese } from "@/lib/prompts";
import { QUICK_REPLIES, getPhase, timeNow, type ChatUIMessage } from "@/lib/chat";
import { DIAGNOSTIC_STORAGE_KEY } from "@/lib/storage";
import type { TerrainProfile } from "@/types/terrain";
import MessageBubble from "./MessageBubble";
import TypingDots from "./TypingDots";
import ProgressBar from "./ProgressBar";
import SynthesisCard from "./SynthesisCard";
import EmailCaptureForm from "./EmailCaptureForm";

interface ChatApiResult {
  text: string;
  demo: boolean;
}

async function callChatApi(
  messages: { role: "user" | "assistant"; content: string }[],
  parcours: ParcoursId,
): Promise<ChatApiResult> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, parcours }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Erreur HTTP ${res.status}`);
  }
  return { text: data.text as string, demo: Boolean(data.demo) };
}

async function persistTerrainProfile(
  parcours: ParcoursId,
  terrain: TerrainProfile,
): Promise<string | null> {
  try {
    const res = await fetch("/api/terrain-profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parcours, terrain }),
    });
    const data = await res.json();
    return res.ok && data.persisted ? (data.id as string) : null;
  } catch {
    return null;
  }
}

export default function ChatAgent({ parcours: parcoursId }: { parcours: ParcoursId }) {
  const router = useRouter();
  const parcours = PARCOURS[parcoursId];
  const [messages, setMessages] = useState<ChatUIMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [synthese, setSynthese] = useState<TerrainProfile | null>(null);
  const [terrainProfileId, setTerrainProfileId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const startedRef = useRef(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const phase = getPhase(messages);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, busy]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setBusy(true);
    const opener =
      parcoursId === "expert"
        ? "Salut, je veux la liste des végétaux pour mon terrain."
        : "Bonjour, je voudrais analyser mon terrain.";

    callChatApi([{ role: "user", content: opener }], parcoursId)
      .then(({ text: raw, demo }) => {
        if (demo) setIsDemo(true);
        setMessages([{ role: "assistant", content: stripSynthese(raw), time: timeNow() }]);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Erreur inconnue.";
        setMessages([
          {
            role: "assistant",
            content: `⚠️ Erreur au démarrage : ${msg}\n\nMais pas de souci, on peut continuer ! Dans quelle région se trouve votre terrain ?`,
            time: timeNow(),
          },
        ]);
      })
      .finally(() => setBusy(false));
  }, [parcoursId]);

  function doSend(text?: string) {
    const txt = (text ?? input).trim();
    if (!txt || busy) return;

    const newMessages: ChatUIMessage[] = [
      ...messages,
      { role: "user", content: txt, time: timeNow() },
    ];
    setMessages(newMessages);
    setInput("");
    setBusy(true);

    const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));
    callChatApi(apiMessages, parcoursId)
      .then(({ text: raw, demo }) => {
        if (demo) setIsDemo(true);
        const found = extractSynthese(raw);
        const clean = stripSynthese(raw);
        setMessages((prev) => [...prev, { role: "assistant", content: clean, time: timeNow() }]);
        if (found) {
          setSynthese(found);
          persistTerrainProfile(parcoursId, found).then(setTerrainProfileId);
        }
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Erreur inconnue.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ Erreur technique : ${msg}`, time: timeNow() },
        ]);
      })
      .finally(() => setBusy(false));
  }

  function handleGenerateGuild() {
    if (!synthese) return;
    sessionStorage.setItem(
      DIAGNOSTIC_STORAGE_KEY,
      JSON.stringify({ terrain: synthese, parcours: parcoursId }),
    );
    router.push("/guildes");
  }

  const quickList = QUICK_REPLIES[Math.min(phase, QUICK_REPLIES.length - 1)] ?? [];

  return (
    <div className="flex h-screen flex-col bg-cream">
      <div className="bg-forest px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-mist"
          >
            ←
          </Link>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-fern bg-moss text-lg">
            🌿
          </div>
          <div className="flex-1">
            <div className="font-sans text-sm font-bold text-cream">Sylvie</div>
            <div className="flex items-center gap-1 text-[10px] text-fern">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-fern" />
              Conseillère en aménagement écologique
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-2 py-1 text-center">
            <div className="text-sm leading-none">{parcours.emoji}</div>
            <div className="font-mono text-[8px] text-mist">{parcours.niveau}</div>
          </div>
        </div>
      </div>

      <ProgressBar phase={phase} />

      {isDemo && (
        <div className="font-sans border-b border-accent/30 bg-accent/15 px-3.5 py-2 text-center text-xs font-semibold text-accent">
          🧪 Mode démo — réponses simulées, sans appel à l&apos;IA
        </div>
      )}

      <div ref={chatRef} className="flex-1 overflow-y-auto px-3 py-3.5">
        {messages.length === 0 && busy && (
          <div className="px-5 py-10 text-center">
            <div className="mb-3 text-5xl">🌿</div>
            <div className="font-display text-lg text-forest">Sylvie prépare vos questions…</div>
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.content} time={m.time} />
        ))}

        {busy && messages.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-fern bg-moss text-base">
              🌿
            </div>
            <div className="rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-white shadow-sm">
              <TypingDots />
            </div>
          </div>
        )}

        {synthese && !busy && (
          <>
            <SynthesisCard data={synthese} onGenerate={handleGenerateGuild} />
            <EmailCaptureForm
              defaultName={synthese.profil?.prenom}
              parcours={parcoursId}
              terrainProfileId={terrainProfileId}
            />
          </>
        )}
      </div>

      {!synthese && (
        <div className="px-3">
          <div className="flex flex-wrap gap-1.5 pb-1.5">
            {quickList.map((r) => (
              <button
                key={r}
                onClick={() => doSend(r)}
                className="font-sans rounded-full border border-mist bg-cream px-3 py-1 text-xs font-medium text-moss"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {!synthese && (
        <div className="flex items-end gap-2 border-t border-sand bg-white px-3 py-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                doSend();
              }
            }}
            placeholder="Écrivez votre réponse…"
            rows={1}
            className="font-sans flex-1 resize-none rounded-xl border-2 border-mist bg-cream px-3.5 py-2 text-sm text-charcoal outline-none focus:border-moss"
          />
          <button
            onClick={() => doSend()}
            disabled={!input.trim() || busy}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-moss text-lg text-white disabled:bg-mist"
          >
            ↑
          </button>
        </div>
      )}
    </div>
  );
}
