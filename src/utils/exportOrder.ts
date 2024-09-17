import { formatCurrencyVND } from "@/libs/utils";
import * as ExcelJS from "exceljs";

export const exportOrderData = (orderData: {
  orderNumber: string;
  paymentStatus: string;
  createdDate: string;
  paidDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    paymentTerms: string;
    orderCode: string;
    couponCode: string;
    deliveryMethod: string;
  };
  shippingAddress: string;
  billingAddress: string;
  items: any[];
  subtotal: number;
  discount: number;
  shipping: number;
  taxAmount: number;
  total: number;
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Order Details");

  // Define heading rows and data rows
  const headingRows = [
    ["Order", orderData.orderNumber],
    ["Payment Status", orderData.paymentStatus],
    ["Created At", orderData.createdDate],
    ["Paid On", orderData.paidDate],
    [],
    ["CUSTOMER & ORDER", ""],
    ["Name", orderData.customer.name],
    ["Email", orderData.customer.email],
    ["Phone", orderData.customer.phone],
    ["Payment Terms", orderData.customer.paymentTerms],
    ["Order Code", orderData.customer.orderCode],
    ["Coupon Code", orderData.customer.couponCode],
    ["Delivery Method", orderData.customer.deliveryMethod],
    [],
    ["SHIPPING ADDRESS", orderData.shippingAddress],
    [],
    ["BILLING ADDRESS", orderData.billingAddress],
    [],
    ["ITEMS ORDERED", "", "", "", ""],
    ["Item Name", "Scent", "Quantity", "Price", "Total"],
  ];

  // Add heading rows and data rows
  worksheet.addRows([
    ...headingRows,
    ...orderData.items.map((item) => [
      item.name,
      item.scent,
      item.quantity,
      formatCurrencyVND(item.price),
      formatCurrencyVND(item.total),
    ]),
    [],
    ["Subtotal", "", "", "", formatCurrencyVND(orderData.subtotal)],
    ["Discount", "", "", "", formatCurrencyVND(orderData.discount)],
    ["Shipping & Handling", "", "", "", formatCurrencyVND(orderData.shipping)],
    ["Tax Amount", "", "", "", formatCurrencyVND(orderData.taxAmount)],
    ["Total", "", "", "", formatCurrencyVND(orderData.total)],
  ]);

  // Merge cells
  worksheet.mergeCells("A6:B6");
  worksheet.mergeCells("A19:E19");

  // Apply bold formatting
  [
    "A1",
    "A2",
    "A3",
    "A4",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10",
    "A11",
    "A12",
    "A13",
    "A15",
    "A16",
    "A17",
    "A19",
    "A20",
    "A23",
    "A24",
    "A25",
    "A26",
    "A27",
    "B27",
    "B20",
    "C20",
    "D20",
    "E20",
  ].forEach((cell) => {
    worksheet.getCell(cell).font = { bold: true };
  });

  // Apply borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell: any) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(new Blob([blob]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `order_${orderData.customer.orderCode}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
};
