export function generateInvoiceHTML({
  invoiceNo,
  toEmail,
  course,
  order,
}) {
  return `
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      color: #2b2b2b;
      background: #ffffff;
    }

    .invoice {
      width: 800px;
      margin: 0 auto;
      padding: 24px;   /* 👈 padding yahin do */
      background: #ffffff;
    }

    /* BRAND */
    .brand {
      font-size: 26px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .brand .blue { color: #2563eb; }
    .brand .dark { color: #0f172a; }

    .pan {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 20px;
    }

    /* HEADER */
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .invoice-meta {
      text-align: right;
      font-size: 12px;
      color: #374151;
    }

    .invoice-meta strong {
      display: block;
      font-size: 14px;
      margin-bottom: 4px;
    }

    /* SECTIONS */
    .section {
      margin-bottom: 18px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .two-col {
      display: flex;
      justify-content: space-between;
      gap: 32px;
      font-size: 13px;
    }

    /* TABLE */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }

    thead th {
      background: #f3f4f6;
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    tbody td {
      padding: 10px 8px;
      border-bottom: 1px solid #e5e7eb;
    }

    /* TOTAL */
    .total-box {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }

    .total {
      width: 240px;
      font-size: 13px;
      color: #374151;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .total-row.final {
      font-size: 15px;
      font-weight: 600;
      border-top: 1px solid #d1d5db;
      padding-top: 6px;
      margin-top: 6px;
    }

    /* FOOTER */
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
      line-height: 1.5;
    }
  </style>

  <div class="invoice">

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
          <div class="section-title">Payment</div>
          Razorpay<br />
          Txn ID: ${order.razorpay_payment_id}
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
      • This is a system-generated invoice for the purchase of digital course
      content on the NerdDocs platform. <br />• GST is not applicable.<br />
      • Payment processed securely via Razorpay.
    </div>

  </div>
`;
}
