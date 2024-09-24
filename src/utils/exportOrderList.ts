import { formatCurrencyVND } from "@/libs/utils";
import * as ExcelJS from "exceljs";

export const exportOrderList = (orders: any) => {
  const orderData = orders.map((order: any) => ({
    orderCode: `#${order.orderCode}`,
    createAt: `${new Date(order.createdAt).toDateString()} - ${new Date(order.createdAt ?? "").toLocaleTimeString("vi-VN")}`,
    name: order?.user?.name || order?.not_user_info?.name,
    email: order?.user?.email || order?.not_user_info?.email,
    status:
      order.status === "paid"
        ? "Paid"
        : order.status === "pending"
          ? "Pending"
          : "Cancelled",
    amount: formatCurrencyVND(order.amount),
    couponCode: order.coupon_code || "",
    couponValue: formatCurrencyVND(order.coupon_value || 0),
    details: order.items
      .map(
        (item: any) =>
          `Fragrance: ${item.variant_id.fragrance}, Quantity: ${item.quantity}, Price: ${formatCurrencyVND(item.price)}`,
      )
      .join("\n"), // Join all item details into a single string, separating them by line breaks.
  }));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Order Data");

  // Set columns for order details
  worksheet.columns = [
    { header: "Order", key: "orderCode", width: 20 },
    { header: "Date", key: "createAt", width: 30 },
    { header: "Customer", key: "name", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Payment", key: "status", width: 15 },
    { header: "Coupon", key: "couponCode", width: 15 },
    { header: "Coupon Value", key: "couponValue", width: 15 },
    { header: "Total Price", key: "amount", width: 15 },
    { header: "Details", key: "details", width: 50 }, // Details column for all item information
  ];

  // Adding each order's data to the worksheet
  orderData.forEach((order: any) => {
    worksheet.addRow(order);
  });

  // Format the header row
  worksheet.getRow(1).font = { bold: true };

  // Apply borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Export Excel file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
};
