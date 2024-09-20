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
import { Card, Chip, TablePagination, Typography } from "@mui/material";

import DebouncedInput from "@/components/DebouncedInput";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import type { ThemeColor } from "@/@core/types";

// type contactStatusType = {
//   [key: string]: {
//     title: string;
//     color: ThemeColor;
//   };
// };

// const contactStatusObj: contactStatusType = {
//   Subscribed: { title: "Subscribed", color: "success" },
//   Unsubscribed: { title: "Unsubscribed", color: "error" },
// };

interface Props {}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export type contactType = {
  _id: string;
  name: string;
  subject: string;
  email: string;
  phone?: string;
  payment?: any;
  message: string;
  createdAt: string;
};

type ContactWithActionsType = contactType & {
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
const columnHelper = createColumnHelper<ContactWithActionsType>();

interface Props {
  contacts: contactType[];
}

const ContactListTable: FC<Props> = ({ contacts }): JSX.Element => {
  const [data, setData] = useState(...[contacts]);

  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<ContactWithActionsType, any>[]>(
    () => [
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: ({ row }) => <Typography>{row.original.subject}</Typography>,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => <Typography>{row.original.name}</Typography>,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: ({ row }) => <Typography>{row.original.email}</Typography>,
      }),
      columnHelper.accessor("phone", {
        header: "Phone",
        cell: ({ row }) => <Typography>{row.original?.phone}</Typography>,
      }),
      columnHelper.accessor("message", {
        header: "Message",
        cell: ({ row }) => <Typography>{row.original?.message}</Typography>,
      }),
      columnHelper.accessor("payment.orderCode", {
        header: "Order Code",
        cell: ({ row }) => (
          <Typography>
            {row.original?.payment?.orderCode
              ? "#" + row.original?.payment?.orderCode
              : ""}
          </Typography>
        ),
      }),
      // columnHelper.accessor("status", {
      //   header: "Status",
      //   cell: ({ row }) => (
      //     <div className="flex items-center gap-3">
      //       <Chip
      //         label={couponStatusObj[row.original.status]?.title}
      //         variant="tonal"
      //         color={couponStatusObj[row.original.status]?.color}
      //         size="small"
      //       />
      //     </div>
      //   ),
      // }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: ({ row }) => (
          <Typography>{`${new Date(row.original.createdAt).toDateString()}`}</Typography>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const table = useReactTable({
    data: data as contactType[],
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
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
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
            {table.getFilteredRowModel().rows.length === 0 ? (
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
          count={table?.getFilteredRowModel()?.rows?.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page);
          }}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        />
      </Card>
    </>
  );
};

export default ContactListTable;
