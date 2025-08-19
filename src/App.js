import { useState } from "react";
import RetrievalVisualizer from "./RetrievalVisualizer";
import VectorDBVisualizer from "./VectorDBVisualizer";

function App() {
  const [view, setView] = useState("retrieval");

  return (
    <div>
      {/* Switch buttons */}
      <div className="flex gap-4 p-4 bg-gray-100 shadow-md">
        <button
          onClick={() => setView("retrieval")}
          className={`px-4 py-2 rounded-lg ${view==="retrieval" ? "bg-black text-white" : "bg-white border"}`}
        >
          Retrieval Walkthrough
        </button>
        <button
          onClick={() => setView("vector")}
          className={`px-4 py-2 rounded-lg ${view==="vector" ? "bg-black text-white" : "bg-white border"}`}
        >
          Vector DB Walkthrough
        </button>
      </div>

      {/* Show the selected visualizer */}
      {view === "retrieval" && <RetrievalVisualizer />}
      {view === "vector" && <VectorDBVisualizer />}
    </div>
  );
}

export default App;
