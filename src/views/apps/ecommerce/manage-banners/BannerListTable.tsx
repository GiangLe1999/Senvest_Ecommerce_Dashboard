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

import { deleteBanner } from "@/app/server/actions";
import DebouncedInput from "@/components/DebouncedInput";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import AddBannerDrawer from "./AddBannerDrawer";
import type { ThemeColor } from "@/@core/types";
import DeleteConfirmDialog from "@/views/dashboards/ecommerce/DeleteConfirmDialog";
import EditBannerDrawer from "./EditBannerDrawer";

type bannerStatusType = {
  [key: string]: {
    title: string;
    color: ThemeColor;
  };
};

const bannerStatusObj: bannerStatusType = {
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

export type bannerType = {
  _id: string;
  name: string;
  image: string;
  status: string;
  order: string;
  link: string;
};

type BannerWithActionsType = bannerType & {
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
const columnHelper = createColumnHelper<BannerWithActionsType>();

interface Props {
  banners: bannerType[];
}

const BannerListTable: FC<Props> = ({ banners }): JSX.Element => {
  // States
  const [addBannerOpen, setAddBannerOpen] = useState(false);
  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [editedBanner, setEditedBanner] = useState<bannerType>();
  const [deleteBannerOpen, setDeleteBannerOpen] = useState(false);
  const [deletedBannerId, setDeletedBannerId] = useState<string>();
  const [deleteBannerLoading, setDeleteBannerLoading] = useState(false);

  const [data, setData] = useState(...[banners]);

  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<BannerWithActionsType, any>[]>(
    () => [
      {
        id: "order",
        header: "Order",
        cell: ({ row }) => <Typography>{row.original.order}</Typography>,
      },
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.image}
              width={38}
              height={38}
              className="rounded-md bg-actionHover object-contain"
            />
            <Typography className="font-medium" color="text.primary">
              {row.original.name}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              label={bannerStatusObj[row.original.status]?.title}
              variant="tonal"
              color={bannerStatusObj[row.original.status]?.color}
              size="small"
            />
          </div>
        ),
      }),
      columnHelper.accessor("link", {
        header: "Link",
        cell: ({ row }) => (
          <div className="max-w-[600px]">
            <Typography
              className="font-medium line-clamp-1"
              color="text.primary"
            >
              {row.original.link}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              size="small"
              onClick={() => {
                setEditBannerOpen(true);
                setEditedBanner(row.original);
              }}
            >
              <i className="ri-edit-box-line text-[22px] text-textSecondary" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setDeleteBannerOpen(true);
                setDeletedBannerId(row.original._id);
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
    data: data as bannerType[],
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

  const deleteBannerHandler = async () => {
    setDeleteBannerLoading(true);

    try {
      if (deletedBannerId) {
        const result = await deleteBanner(deletedBannerId);

        if (result.ok) {
          toast.success("Delete banner successfully");

          setData((prev) => {
            return prev.filter((banner) => banner._id !== deletedBannerId);
          });
        } else {
          console.log;
          toast.error(result?.error);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setDeleteBannerLoading(false);
    setDeleteBannerOpen(false);
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
              onClick={() => setAddBannerOpen(!addBannerOpen)}
              startIcon={<i className="ri-add-line" />}
            >
              Add Banner
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
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page);
          }}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddBannerDrawer
        open={addBannerOpen}
        setData={setData}
        handleClose={() => setAddBannerOpen(!addBannerOpen)}
      />

      <EditBannerDrawer
        open={editBannerOpen}
        setOpen={setEditBannerOpen}
        originalBanner={editedBanner}
        setData={setData}
        handleClose={() => setEditBannerOpen(!editBannerOpen)}
      />

      <DeleteConfirmDialog
        open={deleteBannerOpen}
        setOpen={setDeleteBannerOpen}
        loading={deleteBannerLoading}
        onConfirmDelete={deleteBannerHandler}
      />
    </>
  );
};

export default BannerListTable;
