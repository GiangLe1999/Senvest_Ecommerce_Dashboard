import { formatCurrencyVND } from "@/libs/utils";
import * as ExcelJS from "exceljs";

export const exportOrderList = (orders: any) => {
  const orderData = orders.map((order: any) => ({
    orderCode: `#${order.orderCode}`,
    createAt: `${new Date(order.createdAt).toDateString()} - ${new Date(order.createdAt ?? "").toLocaleTimeString("vi-VN")}`,
    name: order?.user?.name || order?.not_user_info?.name,
    email: order.user.email || order?.not_user_info?.email,
    status:
      order.status === "paid"
        ? "Paid"
        : order.status === "pending"
          ? "Pending"
          : "Cancelled",
    amount: formatCurrencyVND(order.amount),
    couponCode: order.coupon_code || "",
    couponValue: formatCurrencyVND(order.coupon_value || 0),
  }));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Order Data");

  // Đặt các cột tương ứng với dữ liệu từ ảnh
  worksheet.columns = [
    { header: "Order", key: "orderCode", width: 20 },
    { header: "Date", key: "createAt", width: 30 },
    { header: "Customer", key: "name", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Payment", key: "status", width: 15 },
    { header: "Coupon", key: "couponCode", width: 15 },
    { header: "Coupon Value", key: "couponValue", width: 15 },
    { header: "Total Price", key: "amount", width: 15 },
  ];

  // Thêm từng hàng dữ liệu vào bảng tính
  orderData.forEach((order: any) => {
    worksheet.addRow(order);
  });

  // Định dạng chữ đậm cho các tiêu đề
  worksheet.getRow(1).font = { bold: true };

  // Áp dụng đường viền cho tất cả các ô
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

  // Xuất file Excel
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
