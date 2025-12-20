export function generateInvoiceHTML({ invoiceNo, user, toEmail, course, order }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice</title>

  <style>
    @page {
      size: A4;
      margin: 24mm;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      color: #2b2b2b;
    }

    .page {
      min-height: calc(297mm - 48mm);
      display: flex;
      flex-direction: column;
    }

    /* BRAND */
    .brand {
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .brand .blue {
      color: #2563eb;
    }

    .brand .dark {
      color: #0f172a;
    }

    .pan {
      margin-top: 4px;
      font-size: 11px;
      color: #6b7280;
    }

    /* HEADER */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 28px;
    }

    .invoice-meta {
      text-align: right;
      font-size: 12px;
      color: #374151;
    }

    .invoice-meta strong {
      display: block;
      font-size: 14px;
      margin-bottom: 6px;
    }

    /* SECTIONS */
    .section {
      margin-bottom: 28px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .two-col {
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }

    /* TABLE */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }

    thead th {
      background: #f3f4f6;
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }

    tbody td {
      padding: 12px 10px;
      border-bottom: 1px solid #e5e7eb;
    }

    /* TOTAL */
    .total-box {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
    }

    .total {
      width: 260px;
      font-size: 13px;
      color: #374151;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .total-row.final {
      font-size: 15px;
      font-weight: 600;
      border-top: 1px solid #d1d5db;
      padding-top: 8px;
      margin-top: 10px;
    }

    /* FOOTER */
    .footer {
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
      line-height: 1.6;
    }
  </style>
</head>

<body>
  <div class="page">

    <!-- HEADER -->
    <div class="header">
      <div>
        <div class="brand">
          <span class="blue">N</span><span class="dark">erd</span><span class="blue">D</span><span class="dark">ocs</span>
        </div>

        <div class="pan">PAN: DYOPG6466H</div>
      </div>

      <div class="invoice-meta">
        <strong>Invoice</strong>
        Invoice No: ${invoiceNo}<br />
        Date: ${new Date().toLocaleDateString()}
      </div>
    </div>

    <!-- BILLING -->
    <div class="section">
      <div class="two-col">
        <div>
          <div class="section-title">Billed To</div>
          ${toEmail}
        </div>

        <div>
          <div class="section-title">Payment Details</div>
          Method: Razorpay<br />
          Transaction ID: ${order.razorpay_payment_id}
        </div>
      </div>
    </div>

    <!-- ITEMS -->
    <div class="section">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="width:120px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${course.title}</td>
            <td>₹${order.amount / 100}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TOTAL -->
    <div class="total-box">
      <div class="total">
        <div class="total-row">
          <span>Subtotal</span>
          <span>₹${order.amount / 100}</span>
        </div>
        <div class="total-row">
          <span>GST</span>
          <span>₹0</span>
        </div>
        <div class="total-row final">
          <span>Total</span>
          <span>₹${order.amount / 100}</span>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      This is a system-generated invoice for the purchase of digital course
      content on the NerdDocs platform. GST is not applicable.<br />
      Payment processed securely via Razorpay.
    </div>

  </div>
</body>
</html>
`;
}
