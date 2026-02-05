import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ChatArea from "../components/layout/ChatArea";

export default function Home() {
  return (
    <div className="flex h-screen bg-[#0f1115] text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <ChatArea />
      </div>
    </div>
  );
}
