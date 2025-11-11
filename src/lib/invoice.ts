/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoicePDF(data: any) {
  const doc = new jsPDF("p", "mm", "a4");
  const margin = 15; // กำหนด margin ด้านข้าง
  let y = 10;
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("shop-system", margin, y);

  doc.setFontSize(20);
  doc.text("Sales Order", pageWidth / 2, y + 20, { align: "center" });

  y += 30; // spacing หลัง header

  // --- Customer Info Box ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const boxHeight = 40;
  doc.rect(margin, y, 90, boxHeight); // Customer box
  doc.text("Customer Details", margin + 2, y + 6);
  doc.text(`Name: ${data.customerName}`, margin + 2, y + 12);
  doc.text(`Address: ${data.customerAddress}`, margin + 2, y + 18);
  doc.text(`Phone: ${data.customerPhone}`, margin + 2, y + 24);

  // --- Invoice Info Box ---
  const invoiceBoxX = margin + 105;
  doc.rect(invoiceBoxX, y, 80, boxHeight);
  doc.text(`Date: ${data.date}`, invoiceBoxX + 2, y + 6);
  doc.text(`Invoice No: ${data.invoiceNo}`, invoiceBoxX + 2, y + 12);

  y += boxHeight + 5;

  // --- Items Table ---
  const head = [["No", "ProductName", "Qty", "Unit Price", "Amount"]];
  const body = data.items.map(
    (item: {
      productName: any;
      no: any;
      code: any;
      description: any;
      qty: any;
      unit: any;
      price: any;
      amount: any;
    }) => [
      item.no,
      item.productName,
      item.qty,
      item.price,
      item.amount,
    ]
  );

  autoTable(doc, {
    startY: y,
    head,
    body,
    theme: "grid",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [220, 220, 220], halign: "center" },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 75 },
      2: { cellWidth: 15, halign: "right" },
      3: { cellWidth: 25, halign: "right" },
      4: { cellWidth: 25, halign: "right" },
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || y + 50;

  // --- Summary Table ---
  const summaryX = margin + 120;
  const summaryData = [
    ["Subtotal", data.total],
    ["VAT 7%", data.vat],
    ["Total", data.grandTotal],
  ];

  autoTable(doc, {
    startY: finalY + 5,
    body: summaryData,
    theme: "grid",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 30, halign: "right" },
    },
    margin: { left: summaryX },
  });

  // --- Save PDF ---
  doc.save(`SalesOrder_${data.invoiceNo}.pdf`);
}
