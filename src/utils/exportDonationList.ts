import { formatCurrencyVND } from "@/libs/utils";
import * as ExcelJS from "exceljs";

export const exportDonationList = (donations: any) => {
  const donationData = donations.map((donation: any) => ({
    orderCode: `#${donation.orderCode}`,
    createAt: `${new Date(donation.createdAt).toDateString()} - ${new Date(donation.createdAt ?? "").toLocaleTimeString("vi-VN")}`,
    transactionDateTime: donation?.transactionDateTime
      ? `${new Date(donation.transactionDateTime).toDateString()} - ${new Date(donation.transactionDateTime ?? "").toLocaleTimeString("vi-VN")}`
      : "",
    name: donation.name,
    email: donation.email,
    phone: donation.phone,
    status: donation.status === "paid" ? "Paid" : "Cancelled",
    amount: formatCurrencyVND(donation.amount),
    comment: donation.comment || "No comment",
  }));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Donation Data");

  // Set columns for donation details
  worksheet.columns = [
    { header: "Code", key: "orderCode", width: 20 },
    { header: "Status", key: "status", width: 15 },
    { header: "Donor", key: "name", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 20 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Comment", key: "comment", width: 50 },
    { header: "Date", key: "createAt", width: 30 },
    { header: "Transaction Time", key: "transactionDateTime", width: 30 },
  ];

  // Add each donation row to the worksheet
  donationData.forEach((donation: any) => {
    worksheet.addRow(donation);
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
    link.setAttribute("download", `donations.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
};
