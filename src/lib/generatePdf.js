import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportToPdf = async (elementId, fileName = "Laporan-ArusKas.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Tangkap tampilan element HTML menjadi Canvas dengan resolusi tinggi
  const canvas = await html2canvas(element, {
    scale: 2, // Kualitas HD
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
};