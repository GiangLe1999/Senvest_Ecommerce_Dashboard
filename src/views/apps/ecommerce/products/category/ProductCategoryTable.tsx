"use client";

// React Imports
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
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

// Component Imports
import AddCategoryDrawer from "./AddCategoryDrawer";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import EditCategoryDrawer from "./EditCategoryDrawer";
import type { LocalizedString } from "@/entities/common.entity";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export type categoryType = {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  totalProducts: number;
  totalSales: number;
  image?: string;
  status: string;
};

type CategoryWithActionsType = categoryType & {
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
const columnHelper = createColumnHelper<CategoryWithActionsType>();

interface Props {
  categories: categoryType[];
}

const ProductCategoryTable: FC<Props> = ({ categories }) => {
  // States
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [editedCategory, setEditedCategory] = useState<categoryType>();
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [deletedCategoryId, setEditedCategoryId] = useState<string>();

  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(...[categories]);

  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<CategoryWithActionsType, any>[]>(
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
        header: "Categories",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.image}
              width={38}
              height={38}
              className="rounded-md bg-actionHover object-contain"
            />
            <div className="flex flex-col">
              <Typography className="font-medium" color="text.primary">
                {row.original.name.en}
              </Typography>
              <Typography variant="body2">
                {row.original.description.en}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("totalProducts", {
        header: "Total Products",
        cell: ({ row }) => (
          <Typography>{row.original.totalProducts.toLocaleString()}</Typography>
        ),
      }),
      columnHelper.accessor("totalSales", {
        header: "Total Earning",
        cell: ({ row }) => (
          <Typography>
            {row.original.totalSales.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
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
                setEditCategoryOpen(true);
                setEditedCategory(row.original);
              }}
            >
              <i className="ri-edit-box-line text-[22px] text-textSecondary" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setDeleteCategoryOpen(true);
                setEditedCategoryId(row.original._id);
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
    data: data as categoryType[],
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
              color="warning"
              fullWidth
              variant="outlined"
              className="is-full sm:is-auto"
              startIcon={<i className="ri-upload-2-line" />}
            >
              Export
            </Button>
            <Button
              variant="contained"
              className="is-full sm:is-auto"
              onClick={() => setAddCategoryOpen(!addCategoryOpen)}
              startIcon={<i className="ri-add-line" />}
            >
              Add Category
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
      <AddCategoryDrawer
        open={addCategoryOpen}
        categoryData={data}
        setData={setData}
        handleClose={() => setAddCategoryOpen(!addCategoryOpen)}
      />

      <EditCategoryDrawer
        open={editCategoryOpen}
        setOpen={setEditCategoryOpen}
        originalCategory={editedCategory}
        setData={setData}
        handleClose={() => setEditCategoryOpen(!editCategoryOpen)}
      />

      <DeleteCategoryDialog
        open={deleteCategoryOpen}
        setOpen={setDeleteCategoryOpen}
        deletedCategoryId={deletedCategoryId}
        setData={setData}
      />
    </>
  );
};

export default ProductCategoryTable;
