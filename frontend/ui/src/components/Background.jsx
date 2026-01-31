export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-emerald-950/40" />
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full bg-lime-400/10 blur-3xl" />
      <div className="absolute bottom-[-220px] left-1/3 h-[620px] w-[620px] rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[length:26px_26px] opacity-30" />
    </div>
  );
}
