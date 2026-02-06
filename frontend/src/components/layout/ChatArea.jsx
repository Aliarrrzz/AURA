import { motion } from "framer-motion";
import MessageBubble from "../ui/MessageBubble";

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function ChatArea({ messages }) {
  if (!messages?.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Select a chat to start the flow.
      </div>
    );
  }

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="show"
      className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-4"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </motion.div>
  );
}
