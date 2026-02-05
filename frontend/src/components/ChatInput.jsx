import { motion } from "framer-motion";

export default function ChatInput() {
  return (
    <motion.div
      whileFocusWithin={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className="flex gap-3"
    >
      <input
        placeholder="پیامت رو بنویس..."
        className="flex-1 bg-slate-900/80 border border-white/5
        rounded-xl px-4 py-3 text-slate-200
        placeholder:text-slate-500 focus:outline-none
        focus:border-sky-400/40 transition"
      />
      <button
        className="px-4 rounded-xl bg-sky-500/10 text-sky-400
        hover:bg-sky-500/20 transition"
      >
        ارسال
      </button>
    </motion.div>
  );
}
