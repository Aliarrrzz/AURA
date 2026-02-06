import { motion } from "framer-motion";

const bubbleVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function MessageBubble({ message }) {
  const isOwn = message.author === "You";
  return (
    <motion.div
      variants={bubbleVariants}
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-3xl border px-4 py-3 backdrop-blur-xl md:max-w-[60%] ${
          isOwn
            ? "bg-sky-500/15 border-sky-400/20 text-slate-100"
            : "bg-white/10 border-white/10 text-slate-200"
        }`}
      >
        <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
          <span>{message.author}</span>
          <span>{message.time}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed">{message.text}</p>
      </div>
    </motion.div>
  );
}
