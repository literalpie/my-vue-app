import { useState } from "react";
import { ReusableTable } from "./Table/ReusableTable";
import { SortingState, createColumnHelper } from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Octokit } from "@octokit/rest";
import { data as fakeData } from "./shared/data";
import { selectionColumn } from "./Table/selectionColumn";

const useReal = false;
const octokit = new Octokit();

const useTableData = (useRealData: boolean = false) => {
  const {
    data: realData,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<{
    data: { id: number; title: string }[];
    pageNumber: number;
  }>({
    enabled: useRealData,
    queryKey: ["infinite-repos"],
    initialData: { pageParams: [], pages: [] },
    getNextPageParam: (lastPage) => {
      return (lastPage?.pageNumber ?? 0) + 1;
    },
    queryFn: async (context) => {
      const pageNumber = context.pageParam as number;
      const result = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner: "BuilderIO",
        repo: "qwik",
        per_page: 50,
        page: pageNumber,
      });
      return { data: result.data, pageNumber };
    },
    initialPageParam: 1,
  });
  const allData = useRealData
    ? realData.pages.flatMap((page) => page.data)
    : fakeData;

  return {
    data: allData,
    fetchNextPage: () => {
      if (useRealData && !isLoading && !isFetching && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  };
};

export const AppTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<{
    id: number;
    title: string;
  }>();
  const { data, fetchNextPage } = useTableData(useReal);

  return (
    <>
      <div className="px-2">
        <div>
          Sorting {sorting[0]?.id ?? "No Column"} in{" "}
          {sorting[0]?.desc ? "Descending" : "Ascending"} order
        </div>
        <button
          className="btn"
          onClick={() => setSorting([{ id: "title", desc: false }])}
        >
          Sort by Title Ascending
        </button>
      </div>
      <ReusableTable
        selectionActionsRenderer={(rows) => (
          <button className="btn">Delete {rows.join(", ")}</button>
        )}
        fetchMore={fetchNextPage}
        totalCount={useReal ? 400 : data.length}
        sorting={sorting}
        onSortingChange={setSorting}
        data={data}
        columns={[
          selectionColumn,
          columnHelper.accessor("title", {
            id: "title",
            cell: (cell) => <b>{cell.getValue()}</b>,
            header: () => "The Title",
            meta: {
              //// flexSizing is a custom feature to allow columns to grow nicely to fill space,
              //// but it doesn't work well with resizing.
              // flexSizing: {
              //   grow: 1,
              // },
              cellActions: [
                {
                  label: "Log",
                  action: (cell) => console.log("cell action", cell.getValue()),
                },
              ],
            },
            size: 300,
            sortingFn: (first, second) =>
              first.getValue<string>("title").length -
              second.getValue<string>("title").length,
          }),
          columnHelper.accessor("id", {
            size: 100,
            header: () => "ID 0",
            id: "yo",
          }),
          columnHelper.accessor("id", {
            size: 200,
            header: () => "ID 1",
            id: "id1",
          }),
          columnHelper.accessor("id", {
            size: 100,
            header: () => "ID 2",
            id: "id2",
          }),
          columnHelper.accessor("id", {
            size: 100,
            header: () => "ID 3",
            id: "id3",
          }),
          columnHelper.accessor("id", {
            size: 100,
            header: () => "ID 4",
            id: "id4",
          }),
        ]}
      />
    </>
  );
};
