import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadInvoice(container, filename = "invoice.pdf") {
  // Safety check
  if (!container) {
    alert("Invoice container not found");
    return;
  }

  // Force visibility (VERY IMPORTANT)
  const prevOpacity = container.style.opacity;
  container.style.opacity = "1";

  // Wait one frame for paint
  await new Promise((r) => requestAnimationFrame(r));

  // 1️⃣ Capture canvas
  const canvas = await html2canvas(container, {
    scale: 2,                 // sharp text
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  // 2️⃣ Calculate PDF size dynamically
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  // 3️⃣ Draw image
  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    canvas.width,
    canvas.height
  );

  // 4️⃣ Save
  pdf.save(filename);

  // Restore opacity
  container.style.opacity = prevOpacity;
}
