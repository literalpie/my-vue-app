import "./App.css";
import { useState } from "react";
import { ManualTable } from "./ManualTable";

function App() {
  const [activeTab, setActiveTab] = useState<"daisy" | "radix">("daisy");
  return (
    <div>
      <div role="tablist" className="tabs tabs-bordered">
        <a
          role="tab"
          className={activeTab === "daisy" ? "tab tab-active" : "tab"}
          onClick={() => setActiveTab("daisy")}
        >
          Custom (Daisy)
        </a>
        <a
          role="tab"
          className={activeTab === "radix" ? "tab tab-active" : "tab"}
          onClick={() => setActiveTab("radix")}
        >
          Radix
        </a>
      </div>
      <div className="pt-4">
        {activeTab === "daisy" ? <ManualTable /> : null}
      </div>
    </div>
  );
}

export default App;
