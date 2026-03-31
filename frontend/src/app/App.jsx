import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function App() {
  const editorRef = useRef(null);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });
  const [users, setUsers] = useState([]);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;

    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
    );
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setUsername(e.target.username.value);
    window.history.pushState({}, "", "?username=" + e.target.username.value);
  };

  useEffect(() => {
    console.log(username);

    if (username) {
      const provider = new SocketIOProvider("/", "monaco", ydoc, {
        autoConnect: true,
      });

      provider.awareness.setLocalStateField("user", { username });

      const states = Array.from(provider.awareness.getStates().values());

      console.log(states);

      setUsers(
        states
          .filter((state) => state.user && state.user.username)
          .map((state) => state.user),
      );

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values());
        setUsers(
          states
            .filter((state) => state.user && state.user.username)
            .map((state) => state.user),
        );
      });

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null);
      }

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        provider.disconnect();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [username]);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const getRandomColor = (name) => {
    if (!name) return "bg-indigo-500";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "bg-indigo-500",
      "bg-emerald-600",
      "bg-rose-500",
      "bg-amber-600",
      "bg-blue-500",
      "bg-violet-500",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  if (!username) {
    return (
      <main className="h-screen w-full bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 to-violet-500"></div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">CodeSync</h1>
          <p className="text-slate-400 mb-6 font-medium">
            Enter your display name to join the workspace.
          </p>
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Display Name"
              className="p-3 rounded-xl bg-slate-950/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
              name="username"
              required
            />
            <button className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
              Join Workspace
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden">
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur shrink-0 transition-all">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-slate-200 font-semibold text-lg leading-tight tracking-tight">
              CodeSync Workspace
            </h1>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Anonymous Document &bull; Real-time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Connected
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-slate-900/40 border-r border-slate-800 flex flex-col shrink-0">
          <div className="px-4 py-5 border-b border-slate-800 bg-slate-900/50">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              Participants
              <span className="bg-slate-800 text-slate-300 py-0.5 px-2 rounded-full text-[10px]">
                {users.length}
              </span>
            </h2>
          </div>
          <ul className="p-3 flex-1 overflow-y-auto space-y-1">
            {users.map((user, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition-colors group cursor-default"
              >
                <div
                  className={`w-8 h-8 rounded-full ${getRandomColor(user.username)} flex items-center justify-center text-white text-sm font-bold shadow-inner shrink-0`}
                >
                  {getInitials(user.username)}
                </div>
                <span className="text-slate-300 font-medium truncate group-hover:text-white transition-colors">
                  {user.username}
                </span>
                {user.username === username && (
                  <span className="ml-auto text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    YOU
                  </span>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-1 bg-[#1e1e1e] relative w-full h-full shadow-inner">
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="javascript"
            defaultValue="// Start collaborating here..."
            theme="vs-dark"
            onMount={handleMount}
            options={{
              minimap: { enabled: false },
              padding: { top: 24, bottom: 24 },
              fontFamily: "'Inter', 'Consolas', 'Courier New', monospace",
              fontSize: 14,
              lineHeight: 24,
              renderLineHighlight: "all",
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              formatOnPaste: true,
            }}
          />
        </section>
      </div>
    </main>
  );
}

export default App;
