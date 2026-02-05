import { motion } from "framer-motion";
import MessageItem from "./MessageItem";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function MessageList() {
  const messages = [
    { id: 1, user: "Ali", text: "سلام 👋" },
    { id: 2, user: "Sara", text: "این فضا خیلی آرومه" },
    { id: 3, user: "You", text: "Neo-Calm دقیقاً همینه 😌" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full overflow-y-auto px-6 py-4 space-y-2"
    >
      {messages.map((m) => (
        <MessageItem key={m.id} user={m.user} text={m.text} />
      ))}
    </motion.div>
  );
}

