import { useState, useEffect } from "react";
import "preline/preline";
import SessionState from "../../utilities/session-state";
import ProsemirrorEditor from "../../components/editor/editor";

export default function ChatPage() {
  const [onlineUsers, setOnlineUsers] = useState(["Alice", "Bob", "Charlie"]);
  const [files, setFiles] = useState(["Document1.txt", "Notes.md", "Project.pdf"]);
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    const handleUnload = (event: BeforeUnloadEvent) => {
      if (!sessionSaved) {
        event.preventDefault();
        SessionState.getInstance()
          .saveCache()
          .then(() => {
            setSessionSaved(true);
            window.electron.ipcRenderer.sendMessage("app-quit");
          });
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [sessionSaved]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r border-gray-300 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Online Users</h2>
        <ul className="space-y-2">
          {onlineUsers.map((user, index) => (
            <li key={index} className="p-2 bg-white rounded shadow flex items-center">
              <img src="https://placehold.co/40x40" alt="User" className="rounded-full" />
              <span className="ml-3">{user}</span>
            </li>
          ))}
        </ul>
        <h2 className="text-lg font-semibold mt-6 mb-4">Files</h2>
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li key={index} className="p-2 bg-white rounded shadow">{file}</li>
          ))}
        </ul>
        {/* Voice Control Panel */}
        {/* <div className="mt-6 bg-white border rounded shadow p-4 flex justify-between items-center">
          <h3 className="text-md font-semibold">Voice Control</h3>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Start Call
          </button>
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 flex">
        {/* Text Editor */}
        <div className="flex-1 bg-white border rounded shadow p-4">
          <ProsemirrorEditor />
        </div>
      </main>
    </div>
  );
}
