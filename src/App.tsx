import { useState } from "react";
import { ManualTable } from "./DaisyTable";
import { ShadTable } from "./ShadTable";
import { ReusableTable } from "./ReusableTable";
import { SortingState, createColumnHelper } from "@tanstack/react-table";
import { cn } from "./lib/utils";
import { Octokit } from "@octokit/rest";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient();
const ReusableTableWithStuff = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<{
    id: number;
    name: string;
    full_name: string;
  }>();
  const { data, isLoading } = useQuery({
    queryKey: ["storybook-repos"],
    queryFn: () => {
      return new Octokit().rest.repos.listForOrg({ org: "storybookjs" });
    },
  });
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
        data={(data?.data && [...data.data, ...data.data, ...data.data]) || []}
        columns={[
          columnHelper.accessor("name", {
            cell: (cell) => <b>{cell.getValue()}</b>,
          }),
          columnHelper.accessor("id", {}),
          columnHelper.accessor("full_name", {}),
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
      <QueryClientProvider client={queryClient}>
        <div className="pt-4">{getTable(activeTab)}</div>
      </QueryClientProvider>
    </div>
  );
}

export default App;
