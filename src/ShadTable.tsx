import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Project = {
  title: string;
  stars: number;
  author: string;
};

const data: Project[] = [
  {
    author: "literalpie",
    title: "storybook-addon-rtl",
    stars: 5,
  },
  {
    author: "literalpie",
    title: "storybook-addon-knobs",
    stars: 2859,
  },
  {
    author: "literalpie",
    title: "squatAR",
    stars: 1,
  },
  {
    author: "literalpie",
    title: "memorypie",
    stars: 8,
  },
];
const columnHelper = createColumnHelper<Project>();
export const ShadTable = () => {
  const table = useReactTable({
    data,
    columns: [
      columnHelper.accessor("title", {}),
      columnHelper.accessor("author", {}),
      columnHelper.accessor("stars", {}),
    ],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => {
          return (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
