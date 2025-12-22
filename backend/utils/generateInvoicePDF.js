import PdfPrinter from "pdfmake";
import { Buffer } from "buffer";

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

export async function generateInvoicePDF({
  invoiceNo,
  toEmail,
  course,
  order,
}) {
  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    defaultStyle: {
      font: "Helvetica", // 👈 YAHI MISSING THA
    },

    pageMargins: [40, 40, 40, 40],

    content: [
      // BRAND
      {
        text: [
          { text: "N", color: "#2563eb" },
          { text: "erd", color: "#0f172a" },
          { text: "D", color: "#2563eb" },
          { text: "ocs", color: "#0f172a" },
        ],
        fontSize: 26,
        bold: true,
      },
      {
        text: "PAN: DYOPG6466H",
        fontSize: 10,
        color: "#6b7280",
        margin: [0, 4, 0, 16],
      },

      // HEADER META
      {
        columns: [
          [
            { text: "Invoice", fontSize: 14, bold: true },
            { text: `Invoice No: ${invoiceNo}`, fontSize: 10 },
            { text: `Date: ${new Date().toLocaleDateString()}`, fontSize: 10 },
          ],
          [],
        ],
        margin: [0, 0, 0, 20],
      },

      // BILLING + PAYMENT
      {
        columns: [
          [
            { text: "BILLED TO", fontSize: 10, color: "#6b7280" },
            { text: toEmail, fontSize: 12 },
          ],
          [
            { text: "PAYMENT", fontSize: 10, color: "#6b7280" },
            { text: "Razorpay", fontSize: 12 },
            { text: `Txn ID: ${order.razorpay_payment_id}`, fontSize: 11 },
          ],
        ],
        columnGap: 40,
        margin: [0, 0, 0, 20],
      },

      // TABLE
      {
        table: {
          widths: ["*", 120],
          body: [
            [
              { text: "Description", bold: true },
              { text: "Amount", bold: true, alignment: "right" },
            ],
            [
              course.title,
              { text: `₹${order.amount / 100}`, alignment: "right" },
            ],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 20],
      },

      // TOTAL
      {
        columns: [
          { text: "" },
          {
            stack: [
              {
                columns: [
                  { text: "Subtotal" },
                  { text: `₹${order.amount / 100}`, alignment: "right" },
                ],
              },
              {
                columns: [{ text: "GST" }, { text: "₹0", alignment: "right" }],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 200,
                    y2: 0,
                    lineWidth: 1,
                  },
                ],
                margin: [0, 6, 0, 6],
              },
              {
                columns: [
                  { text: "Total", bold: true },
                  {
                    text: `₹${order.amount / 100}`,
                    bold: true,
                    alignment: "right",
                  },
                ],
              },
            ],
            width: 220,
          },
        ],
      },

      // FOOTER
      {
        text: "This is a system-generated invoice for digital educational content.\nGST is not applicable.\nPayment processed via Razorpay.",
        fontSize: 10,
        color: "#6b7280",
        margin: [0, 30, 0, 0],
      },
    ],
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  const chunks = [];
  pdfDoc.on("data", (c) => chunks.push(c));
  pdfDoc.on("end", () => {
    /* resolved below */
  });
  pdfDoc.end();

  return await new Promise((resolve) => {
    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
