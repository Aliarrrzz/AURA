import { motion } from "framer-motion";

export default function MessageItem({ user, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="bg-slate-900/80 border border-white/5 rounded-2xl px-4 py-3"
    >
      <div className="text-xs text-sky-400 mb-1">{user}</div>
      <div className="text-slate-200 leading-relaxed">{text}</div>
    </motion.div>
  );
}
