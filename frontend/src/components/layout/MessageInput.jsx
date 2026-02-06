import { motion } from "framer-motion";

export default function MessageInput() {
  return (
    <motion.div
      whileFocusWithin={{ scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="border-t border-white/10 bg-white/5 backdrop-blur-2xl px-5 md:px-8 py-4"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <input
            placeholder="Write a calm message..."
            className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
        <button className="rounded-2xl border border-white/10 bg-white/15 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/20">
          Send
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Shift + Enter for a new line</span>
        <span className="hidden sm:inline">Powered by calm vibes ✨</span>
      </div>
    </motion.div>
  );
}
