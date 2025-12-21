import puppeteer from "puppeteer";

export async function generateInvoicePDF(html) {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const height = await page.evaluate(() => {
    const body = document.body;
    return Math.ceil(body.scrollHeight);
  });

  const pdfBuffer = await page.pdf({
    width: "210mm",        // A4 width (safe)
    height: `${height}px`, // 🔥 content-based height
    printBackground: true,
    pageRanges: "1",
  });


  await browser.close();
  return pdfBuffer;
}
