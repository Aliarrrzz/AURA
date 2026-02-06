import { motion } from "framer-motion";

export default function Topbar({ chat }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-2xl px-6 py-4"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Current chat
        </p>
        <h1 className="text-lg font-semibold text-slate-100">
          {chat?.name ?? "Select a chat"}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs text-slate-400">Active members</span>
          <span className="text-sm text-slate-200">
            {chat?.members ?? "—"}
          </span>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-200">
          ✨
        </div>
      </div>
    </motion.header>
  );
}
