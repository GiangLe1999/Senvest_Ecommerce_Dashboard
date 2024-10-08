"use client";

// React Imports
import { useEffect, useMemo, useState } from "react";

// Next Imports
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { TextFieldProps } from "@mui/material/TextField";

// Third-party Imports
import classnames from "classnames";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import type { RankingInfo } from "@tanstack/match-sorter-utils";

// Type Imports
import { toast } from "react-toastify";

import type { ReviewType } from "@/types/apps/ecommerceTypes";

// Component Imports
import OptionMenu from "@core/components/option-menu";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import { deleteReview, publishReview } from "@/app/server/actions";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type ReviewWithActionsType = ReviewType & {
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

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<TextFieldProps, "onChange">) => {
  // States
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size="small"
    />
  );
};

// Column Definitions
const columnHelper = createColumnHelper<ReviewWithActionsType>();

const ManageReviewsTable = ({
  reviewsData,
}: {
  reviewsData?: ReviewType[];
}) => {
  // States
  const [status, setStatus] = useState<ReviewType["status"]>("Pending");
  const [rowSelection, setRowSelection] = useState({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [allData, setAllData] = useState(...[reviewsData]);
  const [data, setData] = useState(allData);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<ReviewWithActionsType, any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      columnHelper.accessor("product.name.en", {
        header: "Product",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row?.original?.variant?.images[0]}
              width={38}
              height={38}
              className="rounded-md bg-actionHover"
            />
            <div className="flex flex-col">
              <Typography className="font-medium" color="text.primary">
                {row.original.product.name.en}
              </Typography>
              <Typography variant="body2" className="text-wrap">
                {row.original.variant.fragrance}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Reviewer",
        cell: ({ row }) => (
          <div>
            <Typography
              component={Link}
              href={"/apps/ecommerce/customers/details/879861"}
              color="primary"
              className="font-medium"
            >
              {row.original.name}
            </Typography>
            <Typography variant="body2">{row.original.email}</Typography>
          </div>
        ),
      }),
      columnHelper.accessor("rating", {
        header: "Review",
        sortingFn: (rowA, rowB) => rowA.original.rating - rowB.original.rating,
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <Rating
              name="product-review"
              readOnly
              value={row.original.rating}
              emptyIcon={<i className="ri-star-fill" />}
            />
            <Typography variant="body2" className="text-wrap">
              {row.original.comment}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Date",
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.createdAt);
          const dateB = new Date(rowB.original.createdAt);

          return dateA.getTime() - dateB.getTime();
        },
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "2-digit",
              year: "numeric",
            },
          );

          return <Typography>{date}</Typography>;
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              label={row.original.status}
              variant="tonal"
              color={
                row.original.status === "Published" ? "success" : "warning"
              }
              size="small"
            />
          </div>
        ),
      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: ({ row }) => (
          <OptionMenu
            iconButtonProps={{ size: "medium" }}
            iconClassName="text-textSecondary text-[22px]"
            options={[
              ...(row.original.status === "Pending"
                ? [
                    {
                      text: "Publish",
                      icon: "ri-edit-line",
                      menuItemProps: {
                        onClick: async () => {
                          try {
                            const res = await publishReview({
                              _id: row.original._id,
                            });

                            if (res.ok) {
                              toast.success("Update review successfully");
                              setTimeout(() => {
                                window.location.reload();
                              }, 1000);
                            } else {
                              toast.error(res?.error);
                            }
                          } catch (error) {
                            toast.error("Something went wrong");
                          }
                        },
                        className: "flex items-center",
                      },
                    },
                  ]
                : []),
              {
                text: "Delete",
                icon: "ri-delete-bin-7-line",
                menuItemProps: {
                  onClick: async () => {
                    try {
                      const res = await deleteReview({ _id: row.original._id });

                      if (res.ok) {
                        toast.success("Delete review successfully");
                        setTimeout(() => {
                          window.location.reload();
                        }, 1000);
                      } else {
                        toast.error(res?.error);
                      }
                    } catch (error) {
                      toast.error("Something went wrong");
                    }
                  },
                  className: "flex items-center",
                },
              },
            ]}
          />
        ),
        enableSorting: false,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const table = useReactTable({
    data: data as ReviewType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
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
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  useEffect(() => {
    const filteredData = allData?.filter((review) => {
      if (status !== "Pending" && review.status !== status) return false;

      return true;
    });

    setData(filteredData);
  }, [status, allData, setData]);

  return (
    <>
      <Card>
        <div className="flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search Product"
            className="is-full sm:is-auto"
          />
          <div className="flex flex-col sm:flex-row items-center gap-4 is-full sm:is-auto">
            <FormControl
              fullWidth
              size="small"
              className="sm:is-[140px] flex-auto is-full"
            >
              <Select
                fullWidth
                id="select-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "Published" | "Pending")
                }
                labelId="status-select"
              >
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              className="is-full sm:is-auto"
              startIcon={<i className="ri-upload-2-line" />}
            >
              Export
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
                            className={classnames({
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
                    if (row?.original?.product && row?.original?.variant) {
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
                    } else return null;
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
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
    </>
  );
};

export default ManageReviewsTable;
