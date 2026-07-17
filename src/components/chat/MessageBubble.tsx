export default function MessageBubble({
  role,
  text,
  time,
}: {
  role: "user" | "assistant";
  text: string;
  time?: string;
}) {
  const isBot = role === "assistant";
  return (
    <div className={`mb-2.5 flex ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <div className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full border-2 border-fern bg-moss text-base">
          🌿
        </div>
      )}
      <div
        className={`font-sans max-w-[78%] whitespace-pre-wrap break-words px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isBot
            ? "rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-white text-charcoal"
            : "rounded-tl-2xl rounded-bl-2xl rounded-br-2xl bg-moss text-white"
        }`}
      >
        {text}
        {time && (
          <div className={`mt-1 font-mono text-[10px] ${isBot ? "text-mist" : "text-white/60"}`}>
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
