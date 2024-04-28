import { useState } from "react";
import { ManualTable } from "./DaisyTable";
import { ShadTable } from "./ShadTable";
import { cn } from "./lib/utils";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AppTable } from "./AppTable";

const queryClient = new QueryClient();

type TableType = "daisy" | "shad" | "sharable";
const getTable = (tableType: TableType) => {
  if (tableType === "daisy") {
    return <ManualTable />;
  }
  if (tableType === "shad") {
    return <ShadTable />;
  }
  if (tableType === "sharable") {
    return <AppTable />;
  }
};

function App() {
  const [activeTab, setActiveTab] = useState<TableType>("sharable");

  return (
    <div>
      <div role="tablist" className="tabs tabs-bordered">
        <a
          role="tab"
          className={cn("tab", activeTab === "sharable" && "tab-active")}
          onClick={() => setActiveTab("sharable")}
        >
          Sharable
        </a>
        <a
          role="tab"
          className={cn("tab", activeTab === "daisy" && "tab-active")}
          onClick={() => setActiveTab("daisy")}
        >
          Daisy
        </a>
        <a
          role="tab"
          className={cn("tab", activeTab === "shad" && "tab-active")}
          onClick={() => setActiveTab("shad")}
        >
          Radix
        </a>
      </div>
      <QueryClientProvider client={queryClient}>
        <div className="pt-4">{getTable(activeTab)}</div>
      </QueryClientProvider>
    </div>
  );
}

export default App;
