"use client";

// React Imports
import type { FC } from "react";
import { useState, useMemo } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

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

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import type { OrderType } from "@/types/apps/ecommerceTypes";
import { formatCurrencyVND } from "@/libs/utils";
import { Button } from "@mui/material";
import { exportOrderData } from "@/utils/exportOrder";

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
const columnHelper = createColumnHelper<any>();

const OrderTable = ({ orderData }: { orderData: OrderType }) => {
  // States
  const [rowSelection, setRowSelection] = useState({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[orderData.items]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<any, any>[]>(
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
      columnHelper.accessor("_id.name.en", {
        header: "Product",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row?.original?.variant_id?.images?.[0]}
              alt={row?.original?._id?.name?.en}
              height={34}
            />
            <div>
              <Typography color="text.primary" className="font-medium">
                {row?.original?._id?.name?.en}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("variant_id", {
        header: "Price",
        cell: ({ row }) => (
          <Typography>{`${formatCurrencyVND(row.original.price || 0)}`}</Typography>
        ),
      }),
      columnHelper.accessor("quantity", {
        header: "Qty",
        cell: ({ row }) => (
          <Typography>{`${row.original.quantity}`}</Typography>
        ),
      }),
      columnHelper.accessor("total", {
        header: "Total",
        cell: ({ row }) => (
          <Typography>{`${formatCurrencyVND(row.original.price * row.original.quantity || 0)}`}</Typography>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const table = useReactTable({
    data: data as any[],
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
                          desc: <i className="ri-arrow-down-s-line text-xl" />,
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
          <tbody className="border-be">
            {table
              .getRowModel()
              .rows.slice(0, table.getState().pagination.pageSize)
              .map((row) => {
                return (
                  <tr
                    key={row.id}
                    className={classnames({ selected: row.getIsSelected() })}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="first:is-14">
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
  );
};

interface Props {
  orderData: OrderType;
}

const OrderDetailsCard: FC<Props> = ({ orderData }) => {
  const exportHandler = async () => {
    const customerInfo = orderData?.not_user_info
      ? orderData.not_user_info
      : orderData?.user_address;

    const subtotal = orderData.items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0,
    );

    try {
      exportOrderData({
        orderNumber: `#${orderData.orderCode}`,
        paymentStatus: orderData.status,
        createdDate: `${new Date(orderData.createdAt).toDateString()} - ${new Date(orderData.createdAt ?? "").toLocaleTimeString("vi-VN")}`,
        paidDate: orderData?.transactionDateTime
          ? `${new Date(orderData?.transactionDateTime).toDateString()} - ${new Date(orderData.transactionDateTime ?? "").toLocaleTimeString("vi-VN")}`
          : `${new Date(orderData.updatedAt).toDateString()} - ${new Date(orderData.updatedAt ?? "").toLocaleTimeString("vi-VN")}`,
        customer: {
          name: customerInfo?.name,
          email: orderData?.not_user_info?.email || orderData?.user?.email,
          phone: customerInfo?.phone,
          paymentTerms: "Immediate payment",
          orderCode: `#${orderData.orderCode}`,
          couponCode: orderData?.coupon_code || "",
          deliveryMethod: "Kindle Hope Candles",
        },
        shippingAddress: `${customerInfo.address}, ${customerInfo.city}, ${
          customerInfo.province
        }, ${customerInfo.zip} Vietnam`,
        billingAddress: `${customerInfo.address}, ${customerInfo.city}, ${
          customerInfo.province
        }, ${customerInfo.zip} Vietnam`,
        items: orderData.items.map((item: any) => ({
          name: item._id.name.en || "",
          scent: item.variant_id.fragrance || "",
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal,
        discount: orderData?.coupon_value || 0,
        shipping: 0,
        taxAmount: 0,
        total: orderData.amount,
      });
    } catch (error) {
      console.error("Failed to export user order:", error);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Order Details"
        action={
          <Button
            variant="contained"
            startIcon={<i className="ri-upload-2-line" />}
            onClick={exportHandler}
          >
            Export
          </Button>
        }
      />
      <OrderTable orderData={orderData} />
      <CardContent className="flex justify-end">
        <div>
          <div className="flex items-center gap-12">
            <Typography color="text.primary" className="min-is-[100px]">
              Subtotal:
            </Typography>
            <Typography color="text.primary" className="font-medium">
              {formatCurrencyVND(orderData.amount)}
            </Typography>
          </div>
          <div className="flex items-center gap-12">
            <Typography color="text.primary" className="min-is-[100px]">
              Shipping Fee:
            </Typography>
            <Typography color="text.primary" className="font-medium">
              {formatCurrencyVND(0)}
            </Typography>
          </div>
          <div className="flex items-center gap-12">
            <Typography color="text.primary" className="min-is-[100px]">
              Discount:
            </Typography>
            <Typography color="text.primary" className="font-medium">
              {formatCurrencyVND(orderData?.coupon_value || 0)}
            </Typography>
          </div>
          <div className="flex items-center gap-12">
            <Typography color="text.primary" className="min-is-[100px]">
              Tax:
            </Typography>
            <Typography color="text.primary" className="font-medium">
              {formatCurrencyVND(0)}
            </Typography>
          </div>
          <div className="flex items-center gap-12">
            <Typography
              color="text.primary"
              className="font-medium min-is-[100px]"
            >
              Total:
            </Typography>
            <Typography color="text.primary" className="font-medium">
              {formatCurrencyVND(orderData.amount)}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsCard;
