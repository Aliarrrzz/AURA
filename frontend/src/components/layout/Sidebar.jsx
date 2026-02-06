import { motion } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function Sidebar({ chats, activeId, onSelect }) {
  return (
    <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 bg-white/5 backdrop-blur-2xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Chats</h2>
        <button className="text-xs text-slate-300 bg-white/10 hover:bg-white/15 transition px-3 py-1 rounded-full">
          New
        </button>
      </div>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0"
      >
        {chats.map((chat) => {
          const isActive = chat.id === activeId;
          return (
            <motion.button
              key={chat.id}
              variants={itemVariants}
              onClick={() => onSelect(chat.id)}
              className={`group min-w-[220px] md:min-w-0 text-left rounded-2xl border px-4 py-3 transition ${
                isActive
                  ? "bg-white/15 border-white/20 shadow-[0_8px_30px_rgba(15,23,42,0.45)]"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-100">{chat.name}</span>
                <span className="text-[11px] text-slate-400">{chat.time}</span>
              </div>
              <p className="mt-2 text-xs text-slate-300 line-clamp-2">
                {chat.lastMessage}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                <span
                  className={`h-2 w-2 rounded-full ${
                    chat.status === "online" ? "bg-emerald-400" : "bg-slate-500"
                  }`}
                />
                <span className="uppercase tracking-[0.2em]">
                  {chat.status}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </aside>
  );
}
