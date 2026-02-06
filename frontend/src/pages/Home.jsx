import { useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ChatArea from "../components/layout/ChatArea";
import MessageInput from "../components/layout/MessageInput";

export default function Home() {
  const chats = [
    {
      id: "neo",
      name: "Neo Studio",
      status: "online",
      time: "2m ago",
      members: "8 active",
      lastMessage: "Glassmorphism pass looks beautiful, shipping now.",
    },
    {
      id: "calm",
      name: "Calm Product",
      status: "offline",
      time: "1h ago",
      members: "4 active",
      lastMessage: "Let’s keep the animations soft and airy.",
    },
    {
      id: "zen",
      name: "Zen Research",
      status: "online",
      time: "Yesterday",
      members: "6 active",
      lastMessage: "Sharing user notes on the new flow.",
    },
  ];

  const messageMap = useMemo(
    () => ({
      neo: [
        {
          id: 1,
          author: "Lina",
          text: "The gradient is landing perfectly with the glass blur.",
          time: "09:41",
        },
        {
          id: 2,
          author: "You",
          text: "Amazing. I’ll refine the message bubbles with softer edges.",
          time: "09:42",
        },
        {
          id: 3,
          author: "Noah",
          text: "Adding subtle glow on hover keeps it calm and premium.",
          time: "09:45",
        },
      ],
      calm: [
        {
          id: 1,
          author: "Ava",
          text: "We should keep the input minimal and focused.",
          time: "18:02",
        },
        {
          id: 2,
          author: "You",
          text: "Agree. I’ll smooth out the transitions for every interaction.",
          time: "18:05",
        },
      ],
      zen: [
        {
          id: 1,
          author: "Mina",
          text: "Users respond best to the muted palette.",
          time: "11:12",
        },
        {
          id: 2,
          author: "You",
          text: "I’ll keep the neutrals and add a gentle sky accent.",
          time: "11:14",
        },
        {
          id: 3,
          author: "Theo",
          text: "Spacing feels airy. Keep the rhythm like this.",
          time: "11:15",
        },
      ],
    }),
    []
  );

  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="flex h-screen flex-col md:flex-row">
        <Sidebar
          chats={chats}
          activeId={activeChatId}
          onSelect={setActiveChatId}
        />
        <div className="flex flex-1 flex-col">
          <Topbar chat={activeChat} />
          <ChatArea messages={messageMap[activeChatId]} />
          <MessageInput />
        </div>
      </div>
    </div>
  );
}
