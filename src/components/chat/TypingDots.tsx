export default function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fern [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fern [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-fern" />
    </div>
  );
}
