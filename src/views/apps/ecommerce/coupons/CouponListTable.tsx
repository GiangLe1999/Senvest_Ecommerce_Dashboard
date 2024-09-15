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

import { deleteBanner, deleteCoupon } from "@/app/server/actions";
import DebouncedInput from "@/components/DebouncedInput";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import AddBannerDrawer from "./AddCouponDrawer";
import type { ThemeColor } from "@/@core/types";
import DeleteConfirmDialog from "@/views/dashboards/ecommerce/DeleteConfirmDialog";
import EditBannerDrawer from "./EditCouponDrawer";
import { formatCurrencyVND } from "@/libs/utils";
import AddCouponDrawer from "./AddCouponDrawer";
import EditCouponDrawer from "./EditCouponDrawer";

type couponStatusType = {
  [key: string]: {
    title: string;
    color: ThemeColor;
  };
};

const couponStatusObj: couponStatusType = {
  Active: { title: "Active", color: "success" },
  Expired: { title: "Expired", color: "error" },
  Used: { title: "Used", color: "warning" },
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

export type couponType = {
  _id: string;
  code: string;
  status: "Active" | "Expired" | "Used";
  discount_value: number;
  expiry_date: Date;
  usage_count: number;
  assigned_to_email?: string;
  discount_type: "Percent" | "Value";
};

type CouponWithActionsType = couponType & {
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
const columnHelper = createColumnHelper<CouponWithActionsType>();

interface Props {
  coupons: couponType[];
}

const CouponListTable: FC<Props> = ({ coupons }): JSX.Element => {
  // States
  const [addCouponOpen, setAddCouponOpen] = useState(false);
  const [editCouponOpen, setEditCouponOpen] = useState(false);
  const [editedCoupon, setEditedCoupon] = useState<couponType>();
  const [deleteCouponOpen, setDeleteCouponOpen] = useState(false);
  const [deletedCouponId, setDeletedCouponId] = useState<string>();
  const [deleteCouponLoading, setDeleteCouponLoading] = useState(false);

  const [data, setData] = useState(...[coupons]);

  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<CouponWithActionsType, any>[]>(
    () => [
      {
        id: "code",
        header: "Code",
        cell: ({ row }) => <Typography>{row.original.code}</Typography>,
      },
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              label={couponStatusObj[row.original.status]?.title}
              variant="tonal"
              color={couponStatusObj[row.original.status]?.color}
              size="small"
            />
          </div>
        ),
      }),
      columnHelper.accessor("discount_value", {
        header: "Discount Value",
        cell: ({ row }) => (
          <Typography className="font-medium line-clamp-1" color="text.primary">
            {row.original.discount_type === "Percent"
              ? row.original.discount_value + "%"
              : formatCurrencyVND(row.original.discount_value)}
          </Typography>
        ),
      }),
      columnHelper.accessor("expiry_date", {
        header: "Expiry Date",
        cell: ({ row }) => (
          <Typography>{`${new Date(row.original.expiry_date).toDateString()}`}</Typography>
        ),
      }),
      columnHelper.accessor("usage_count", {
        header: "Usage count",
        cell: ({ row }) => <Typography>{row.original.usage_count}</Typography>,
      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              size="small"
              onClick={() => {
                setEditCouponOpen(true);
                setEditedCoupon(row.original);
              }}
            >
              <i className="ri-edit-box-line text-[22px] text-textSecondary" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setDeleteCouponOpen(true);
                setDeletedCouponId(row.original._id);
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
    data: data as couponType[],
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

  const deleteCouponHandler = async () => {
    setDeleteCouponLoading(true);

    try {
      if (deletedCouponId) {
        const result = await deleteCoupon(deletedCouponId);

        if (result.ok) {
          toast.success("Delete coupon successfully");

          setData((prev) => {
            return prev.filter((banner) => banner._id !== deletedCouponId);
          });
        } else {
          console.log;
          toast.error(result?.error);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setDeleteCouponLoading(false);
    setDeleteCouponOpen(false);
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
              onClick={() => setAddCouponOpen(!addCouponOpen)}
              startIcon={<i className="ri-add-line" />}
            >
              Add Coupon
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
      <AddCouponDrawer
        open={addCouponOpen}
        setData={setData}
        handleClose={() => setAddCouponOpen(!addCouponOpen)}
      />

      <EditCouponDrawer
        open={editCouponOpen}
        setOpen={setEditCouponOpen}
        originalCoupon={editedCoupon}
        setData={setData}
        handleClose={() => setEditCouponOpen(!editCouponOpen)}
      />

      <DeleteConfirmDialog
        open={deleteCouponOpen}
        setOpen={setDeleteCouponOpen}
        loading={deleteCouponLoading}
        onConfirmDelete={deleteCouponHandler}
      />
    </>
  );
};

export default CouponListTable;
