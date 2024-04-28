import { useState } from "react";
import { ReusableTable } from "./Table/ReusableTable";
import { SortingState, createColumnHelper } from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Octokit } from "@octokit/rest";
import { data as fakeData } from "./shared/data";

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
  const { data } = useTableData(useReal);

  return (
    <>
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
      <ReusableTable
        fetchMore={() => {}}
        totalCount={useReal ? 400 : data.length}
        sorting={sorting}
        onSortingChange={setSorting}
        data={data}
        columns={[
          columnHelper.accessor("title", {
            id: "title",
            cell: (cell) => <b>{cell.getValue()}</b>,
            header: () => "The Title",
            meta: {
              flexSizing: {
                grow: 3,
                maxSize: 500,
                shrink: 0,
              },
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
            meta: {
              flexSizing: {
                grow: 0,
                maxSize: 300,
                minSize: 50,
                shrink: 1,
              },
            },
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
