import { motion } from "framer-motion";

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-72 bg-[#131722] border-r border-white/5 p-4"
    >
      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
          Neo Team
        </div>
        <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
          Design
        </div>
      </div>
    </motion.aside>
  );
}
