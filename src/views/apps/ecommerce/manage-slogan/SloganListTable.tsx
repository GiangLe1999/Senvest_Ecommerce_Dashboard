"use client";

import { useMemo, useState, type FC } from "react";

// Third-party Imports
import classnames from "classnames";
import classNames from "classnames";

import { rankItem, type RankingInfo } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import {
  Button,
  Card,
  Chip,
  IconButton,
  TablePagination,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import { format, parseISO } from "date-fns";

import { deleteSlogan } from "@/app/server/actions";
import DebouncedInput from "@/components/DebouncedInput";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import type { ThemeColor } from "@/@core/types";
import DeleteConfirmDialog from "@/views/dashboards/ecommerce/DeleteConfirmDialog";
import AddSloganDrawer from "./AddSloganDrawer";
import EditSloganDrawer from "./EditSloganDrawer";

type sloganStatusType = {
  [key: string]: {
    title: string;
    color: ThemeColor;
  };
};

const sloganStatusObj: sloganStatusType = {
  Active: { title: "Active", color: "success" },
  Inactive: { title: "Inactive", color: "error" },
};

interface Props {}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export type sloganType = {
  _id: string;
  content: string;
  status: string;
  updatedAt: string;
  order: string;
};

type SloganWithActionsType = sloganType & {
  actions?: string;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// Column Definitions
const columnHelper = createColumnHelper<SloganWithActionsType>();

interface Props {
  slogans: sloganType[];
}

const SloganListTable: FC<Props> = ({ slogans }): JSX.Element => {
  // States
  const [addSloganOpen, setAddSloganOpen] = useState(false);
  const [editSloganOpen, setEditSloganOpen] = useState(false);
  const [editedSlogan, setEditedSlogan] = useState<sloganType>();
  const [deleteSloganOpen, setDeleteSloganOpen] = useState(false);
  const [deletedSloganId, setDeletedSloganId] = useState<string>();
  const [deleteSloganLoading, setDeleteSloganLoading] = useState(false);

  const [data, setData] = useState(...[slogans]);

  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<SloganWithActionsType, any>[]>(
    () => [
      {
        id: "order",
        header: "Order",
        cell: ({ row }) => <Typography>{row.original.order}</Typography>,
      },
      columnHelper.accessor("content", {
        header: "Content",
        cell: ({ row }) => (
          <Typography className="font-medium" color="text.primary">
            {row.original.content}
          </Typography>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              label={sloganStatusObj[row.original.status]?.title}
              variant="tonal"
              color={sloganStatusObj[row.original.status]?.color}
              size="small"
            />
          </div>
        ),
      }),
      columnHelper.accessor("updatedAt", {
        header: "Update At",
        cell: ({ row }) => (
          <Typography>
            {format(
              parseISO(row.original.updatedAt),
              "hh:mm a - EEEE, dd/MM/yyyy",
            )}
          </Typography>
        ),
      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              size="small"
              onClick={() => {
                setEditSloganOpen(true);
                setEditedSlogan(row.original);
              }}
            >
              <i className="ri-edit-box-line text-[22px] text-textSecondary" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setDeleteSloganOpen(true);
                setDeletedSloganId(row.original._id);
              }}
            >
              <i className="ri-delete-bin-7-line text-[22px] text-textSecondary" />
            </IconButton>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const table = useReactTable({
    data: data as sloganType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const deleteSloganHandler = async () => {
    setDeleteSloganLoading(true);

    try {
      if (deletedSloganId) {
        const result = await deleteSlogan(deletedSloganId);

        if (result.ok) {
          toast.success("Delete slogan successfully");

          setData((prev) => {
            return prev.filter((slogan) => slogan._id !== deletedSloganId);
          });
        } else {
          console.log;
          toast.error(result?.error);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setDeleteSloganLoading(false);
    setDeleteSloganOpen(false);
  };

  return (
    <>
      <Card>
        <div className="flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search"
            className="is-full sm:is-auto"
          />
          <div className="flex flex-col items-center gap-4 is-full sm:flex-row sm:is-auto">
            <Button
              variant="contained"
              className="is-full sm:is-auto"
              onClick={() => setAddSloganOpen(!addSloganOpen)}
              startIcon={<i className="ri-add-line" />}
            >
              Add Slogan
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classNames({
                              "flex items-center": header.column.getIsSorted(),
                              "cursor-pointer select-none":
                                header.column.getCanSort(),
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: <i className="ri-arrow-up-s-line text-xl" />,
                              desc: (
                                <i className="ri-arrow-down-s-line text-xl" />
                              ),
                            }[header.column.getIsSorted() as "asc" | "desc"] ??
                              null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table?.getFilteredRowModel()?.rows?.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className="text-center"
                  >
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className={classnames({
                          selected: row.getIsSelected(),
                        })}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          className="border-bs"
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page);
          }}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddSloganDrawer
        open={addSloganOpen}
        setData={setData}
        handleClose={() => setAddSloganOpen(!addSloganOpen)}
      />

      <EditSloganDrawer
        open={editSloganOpen}
        setOpen={setEditSloganOpen}
        originalSlogan={editedSlogan}
        setData={setData}
        handleClose={() => setEditSloganOpen(!editSloganOpen)}
      />

      <DeleteConfirmDialog
        open={deleteSloganOpen}
        setOpen={setDeleteSloganOpen}
        loading={deleteSloganLoading}
        onConfirmDelete={deleteSloganHandler}
      />
    </>
  );
};

export default SloganListTable;
