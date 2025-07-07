import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { initTable, setTableParams } from "@/store/features/datatableSlice";
  import { type RootState } from "@/store/store";
  import {
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import { ArrowDown, ArrowUp } from "lucide-react";
  import { useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useLocation, useNavigate } from "react-router";
  import BottomContent from "./BottomContent";
  import TopContent from "./TopContent";
  import type { CustomColumnDef } from "./type";
  
  export interface PaginationMeta {
    total_records: number;
    page_size: number;
    current_page: number;
    total_pages: number;
  }
  
  interface DataTableProps<TData> {
    columns: CustomColumnDef<TData>[];
    data: TData[];
    title: string;
    paginationMeta?: PaginationMeta;
    isLoading?: boolean;
    tableKey: string;
    openModal: () => void;
  }
  
  const DEFAULT_STATE = {
    page: 1,
    page_size: 10,
    sort: undefined,
    order: undefined,
    search: undefined,
    status: undefined,
  };
  
  export default function DataTable<TData>({
    columns,
    data,
    title,
    paginationMeta,
    isLoading = false,
    tableKey,
    openModal,
  }: DataTableProps<TData>) {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const tableState = useSelector(
      (state: RootState) => state.datatable[tableKey] || DEFAULT_STATE
    );
  
    // Initialize table state in Redux
    useEffect(() => {
      dispatch(initTable({ key: tableKey, initial: DEFAULT_STATE }));
    }, [dispatch, tableKey]);
  
    // Sync Redux state to URL
    useEffect(() => {
      const params = new URLSearchParams();
      Object.entries(tableState).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== '' &&
          value !== 'all'
        ) {
          if (
            typeof value === 'object' &&
            value !== null &&
            'from' in value &&
            'to' in value
          ) {
            if ((value as any).from) params.set(`${key}_from`, String((value as any).from));
            if ((value as any).to) params.set(`${key}_to`, String((value as any).to));
          } else if (typeof value !== 'object') {
            params.set(key, String(value));
          }
        }
      });
      const queryString = params.toString();
      const newUrl = queryString
        ? `${location.pathname}?${queryString}`
        : location.pathname;
      if (location.search !== `?${queryString}`) {
        navigate(newUrl, { replace: true });
      }
    }, [tableState, navigate, location.pathname]);
  
    // Table instance
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      manualSorting: true,
      state: {
        sorting: tableState.sort
          ? [{ id: tableState.sort, desc: tableState.order === "desc" }]
          : [],
      },
    });
  
    // Sorting handler
    const handleSorting = (header: any) => {
      if (!header.column.getCanSort()) return;
      const currentField = tableState.sort;
      const currentDirection = tableState.order;
      let newDirection: "asc" | "desc" = "asc";
      if (currentField === header.column.id && currentDirection === "asc") {
        newDirection = "desc";
      }
      dispatch(
        setTableParams({
          key: tableKey,
          params: { sort: header.column.id, order: newDirection, page: 1 },
        })
      );
    };
  
    // Filter handler (for TopContent, if you want to support it)
    const handleFilterChange = (newFilters: Record<string, any>) => {
      const updatedFilters: Record<string, any> = {
        ...tableState,
        ...newFilters,
        page: 1,
      };
      // Remove empty filters
      Object.keys(updatedFilters).forEach((key) => {
        if (
          updatedFilters[key] === "" ||
          updatedFilters[key] === "all" ||
          updatedFilters[key] === null ||
          updatedFilters[key] === undefined
        ) {
          delete updatedFilters[key];
        }
      });
      dispatch(setTableParams({ key: tableKey, params: updatedFilters }));
    };

  
    // Pagination handlers
    const handlePageChange = (page: number) => {
      dispatch(setTableParams({ key: tableKey, params: { page } }));
    };
    const handlePageSizeChange = (page_size: number) => {
      dispatch(setTableParams({ key: tableKey, params: { page_size, page: 1 } }));
    };
  
    return (
      <div className="flex flex-col h-full min-h-screen overflow-hidden py-2 px-4">
        <div className="sticky top-0 bg-background overflow-hidden">
          <TopContent
            table={table}
            title={title}
            onFilterChange={handleFilterChange}
            filters={tableState}
            meta={
              paginationMeta
                ? {
                    total: paginationMeta.total_records,
                    page: paginationMeta.current_page,
                    page_size: paginationMeta.page_size,
                  }
                : { total: 0, page: 1, page_size: 10 }
            }
            openModal={openModal}
            tableKey={tableKey}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="rounded-md border min-w-full">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isSorted =
                        tableState.sort === header.column.id
                          ? tableState.order
                          : undefined;
                      return (
                        <TableHead
                          key={header.id}
                          onClick={() => handleSorting(header)}
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }
                        >
                          <div className="flex items-center justify-start gap-2">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            {isSorted === "asc" && (
                              <ArrowUp className="h-4 w-4" />
                            )}
                            {isSorted === "desc" && (
                              <ArrowDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {paginationMeta && (
          <div className="sticky bottom-0 bg-background max-w-[78vw] overflow-hidden">
            <BottomContent
              paginationMeta={paginationMeta}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    );
  }
  