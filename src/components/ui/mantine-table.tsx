import { Eye } from "lucide-react";
import {
  MantineReactTable,
  MRT_Row,
  MRT_TableOptions,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";

type TableProps<T extends Record<string, any>> = {
  columns: MRT_ColumnDef<T>[];
  data: T[];
  onActionClick?: (row: MRT_Row<T>) => void;
} & MRT_TableOptions<T>;

function Table<T extends Record<string, any>>({
  columns,
  data,
  onActionClick,
  ...props
}: TableProps<T>) {
  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableDensityToggle: false,
    positionToolbarAlertBanner: "bottom",
    enableRowActions: true,
    renderRowActions: ({ row }) => {
      return (
        <Eye
          size={16}
          onClick={() => onActionClick && onActionClick(row)}
          className="hover:cursor-pointer"
        />
      );
    },
    positionActionsColumn: "last",
    initialState: {
      density: "xs", //set default density to compact
      pagination: { pageIndex: 0, pageSize: 25 }, //set different default page size
    },

    ...props,
  });

  return <MantineReactTable table={table} />;
}

export { Table };
