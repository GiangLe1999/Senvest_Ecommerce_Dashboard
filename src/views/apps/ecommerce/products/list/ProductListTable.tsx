"use client";

// React Imports
import { useEffect, useMemo, useState } from "react";

// Next Imports
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
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

import type { ThemeColor } from "@core/types";
import type { ProductType } from "@/types/apps/ecommerceTypes";

// Component Imports
import TableFilters from "./TableFilters";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import DeleteConfirmDialog from "@/views/dashboards/ecommerce/DeleteConfirmDialog";
import { deleteProduct } from "@/app/server/actions";
import { removeHTMLTags } from "@/utils/removeHTMLTags";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type ProductWithActionsType = ProductType & {
  actions?: string;
};

type productStatusType = {
  [key: string]: {
    title: string;
    color: ThemeColor;
  };
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

const productStatusObj: productStatusType = {
  Published: { title: "Publish", color: "success" },
  Inactive: { title: "Inactive", color: "error" },
};

// Column Definitions
const columnHelper = createColumnHelper<ProductWithActionsType>();

const ProductListTable = ({ productData }: { productData?: ProductType[] }) => {
  // States
  const [data, setData] = useState(...[productData]);
  const [rowSelection, setRowSelection] = useState({});
  const [deleteProductOpen, setDeleteProductOpen] = useState(false);
  const [deletedProductId, setEditedProductId] = useState<string>();
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);

  const [filteredData, setFilteredData] = useState(data);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<ProductWithActionsType, any>[]>(
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
      columnHelper.accessor("name.en", {
        header: "Product",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.images[0]}
              width={38}
              height={38}
              className="rounded-md bg-actionHover object-contain"
            />
            <div className="flex flex-col">
              <Typography className="font-medium" color="text.primary">
                {row.original.name.en}
              </Typography>
              <div className="max-w-[300px]">
                <Typography variant="body2" className="line-clamp-1">
                  {removeHTMLTags(row.original.description.en)}
                </Typography>
              </div>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original?.category?.image}
              alt={row.original?.category?.name.en}
              className="rounded-full object-contain bg-actionHover"
              width={30}
              height={30}
            />
            <Typography color="text.primary">
              {row.original?.category?.name.en}
            </Typography>
          </div>
        ),
      }),
      columnHelper.accessor("variants", {
        header: "Price",
        cell: ({ row }) => (
          <Typography>{row.original.variants?.[0].price}</Typography>
        ),
      }),
      columnHelper.accessor("variants", {
        header: "Stock",
        cell: ({ row }) => (
          <Typography>
            {row.original.variants.reduce((a, b) => a + b.stock, 0)}
          </Typography>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              label={productStatusObj[row.original.status].title}
              variant="tonal"
              color={productStatusObj[row.original.status].color}
              size="small"
            />
          </div>
        ),
      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Link href={`/products/update/${row.original._id}`}>
              <IconButton size="small">
                <i className="ri-edit-box-line text-[22px] text-textSecondary" />
              </IconButton>
            </Link>
            <IconButton
              size="small"
              onClick={() => {
                setDeleteProductOpen(true);
                setEditedProductId(row.original._id);
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
    [data, filteredData],
  );

  const table = useReactTable({
    data: filteredData as ProductType[],
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

  const deleteProductHandler = async () => {
    setDeleteProductLoading(true);

    try {
      if (deletedProductId) {
        const result = await deleteProduct(deletedProductId);

        if (result.ok) {
          toast.success("Delete product successfully");

          setData((prev) => {
            return prev?.filter((product) => product._id !== deletedProductId);
          });
        } else {
          console.log;
          toast.error(result?.error);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setDeleteProductLoading(false);
    setDeleteProductOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader title="Filters" />
        <TableFilters setData={setFilteredData} productData={data} />
        <Divider />
        <div className="flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search Product"
            className="is-full sm:is-auto"
          />
          <div className="flex flex-col sm:flex-row items-center gap-4 is-full sm:is-auto">
            <Button
              color="warning"
              className="is-full sm:is-auto"
              variant="outlined"
              startIcon={<i className="ri-upload-2-line" />}
            >
              Export
            </Button>
            <Button
              variant="contained"
              component={Link}
              href={"/products/add"}
              startIcon={<i className="ri-add-line" />}
              className="is-full sm:is-auto"
            >
              Add Product
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

      <DeleteConfirmDialog
        open={deleteProductOpen}
        setOpen={setDeleteProductOpen}
        loading={deleteProductLoading}
        onConfirmDelete={deleteProductHandler}
      />
    </>
  );
};

export default ProductListTable;
