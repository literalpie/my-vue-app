import { useState } from "react";
import { ManualTable } from "./DaisyTable";
import { ShadTable } from "./ShadTable";
import { ReusableTable } from "./ReusableTable";
import { data } from "./shared/data";
import { SortingState, createColumnHelper } from "@tanstack/react-table";
import { Project } from "./shared/types";
import { cn } from "./lib/utils";

const ReusableTableWithStuff = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<Project>();
  return (
    <>
      <div>
        Sorting {sorting[0]?.id ?? "No Column"} in{" "}
        {sorting[0]?.desc ? "Descending" : "Ascending"} order
      </div>
      <button
        className="btn"
        onClick={() => setSorting([{ id: "author", desc: false }])}
      >
        Sort by Author Ascending
      </button>
      <ReusableTable
        sorting={sorting}
        onSortingChange={setSorting}
        data={data}
        columns={[
          columnHelper.accessor("title", {
            cell: (cell) => <b>{cell.getValue()}</b>,
          }),
          columnHelper.accessor("author", {}),
          columnHelper.accessor("stars", {}),
        ]}
      />
    </>
  );
};

type TableType = "daisy" | "shad" | "sharable";
const getTable = (tableType: TableType) => {
  if (tableType === "daisy") {
    return <ManualTable />;
  }
  if (tableType === "shad") {
    return <ShadTable />;
  }
  if (tableType === "sharable") {
    return <ReusableTableWithStuff />;
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
      <div className="pt-4">{getTable(activeTab)}</div>
    </div>
  );
}

export default App;
