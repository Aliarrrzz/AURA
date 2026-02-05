import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatPage() {
  return (
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col">
      <header className="h-14 flex items-center px-6 border-b border-white/5">
        <h1 className="text-slate-100 font-medium">Neo-Calm Chat</h1>
      </header>

      <main className="flex-1 overflow-hidden">
        <MessageList />
      </main>

      <footer className="p-4 border-t border-white/5">
        <ChatInput />
      </footer>
    </div>
  );
}
