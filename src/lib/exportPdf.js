import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (transactions, month, year) => {
  const pdf = new jsPDF("p", "mm", "a4");

  // 1. HITUNG RINGKASAN DATA
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  // 2. HEADER BRANDING (ArusKas)
  pdf.setFillColor(3, 7, 18); // Dark Navy (Slate-950)
  pdf.rect(0, 0, 210, 38, "F");

  // Nama Brand
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("Arus", 14, 22);

  pdf.setTextColor(34, 211, 238); // Cyan Accent
  pdf.text("Kas", 33, 22);

  // Subtitle & Periode Header
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(148, 163, 184); // Slate-400
  pdf.text("FINANCIAL MANAGEMENT SYSTEM", 14, 28);

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Periode: ${month + 1}/${year}`, 196, 22, { align: "right" });
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(148, 163, 184);
  pdf.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, 196, 28, { align: "right" });

  // 3. CARDS RINGKASAN FINANSIAL
  // Card Pemasukan
  pdf.setFillColor(240, 253, 244); // Light Emerald
  pdf.setDrawColor(220, 252, 231);
  pdf.roundedRect(14, 45, 58, 20, 3, 3, "FD");
  pdf.setFontSize(8);
  pdf.setTextColor(22, 101, 52);
  pdf.text("TOTAL PEMASUKAN", 18, 51);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Rp ${totalIncome.toLocaleString("id-ID")}`, 18, 59);

  // Card Pengeluaran
  pdf.setFillColor(254, 242, 242); // Light Rose
  pdf.setDrawColor(254, 226, 226);
  pdf.roundedRect(76, 45, 58, 20, 3, 3, "FD");
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(153, 27, 27);
  pdf.text("TOTAL PENGELUARAN", 80, 51);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Rp ${totalExpense.toLocaleString("id-ID")}`, 80, 59);

  // Card Sisa Saldo
  pdf.setFillColor(239, 246, 255); // Light Blue
  pdf.setDrawColor(219, 234, 254);
  pdf.roundedRect(138, 45, 58, 20, 3, 3, "FD");
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(30, 64, 175);
  pdf.text("SELISIH / NET", 142, 51);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Rp ${balance.toLocaleString("id-ID")}`, 142, 59);

  // 4. TABEL TRANSAKSI
  autoTable(pdf, {
    startY: 72,
    head: [["Tanggal", "Jenis", "Kategori", "Catatan", "Jumlah"]],
    body: transactions.map((t) => [
      t.transactionDate?.seconds
        ? new Date(t.transactionDate.seconds * 1000).toLocaleDateString("id-ID")
        : new Date(t.transactionDate).toLocaleDateString("id-ID"),
      t.type === "income" ? "Pemasukan" : "Pengeluaran",
      t.category || "-",
      t.note || "-",
      `${t.type === "income" ? "+" : "-"} Rp ${Number(t.amount).toLocaleString("id-ID")}`,
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 3.5,
      font: "helvetica",
    },
    headStyles: {
      fillColor: [15, 23, 42], // Dark Slate-900
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 28 },
      2: { cellWidth: 35 },
      3: { cellWidth: "auto" },
      4: { halign: "right", fontStyle: "bold", cellWidth: 35 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Belang halus Slate-50
    },
    didParseCell: (data) => {
      // Mewarnai teks jumlah: Hijau untuk Pemasukan, Merah untuk Pengeluaran
      if (data.section === "body" && data.column.index === 4) {
        const rawValue = data.cell.raw;
        if (rawValue.startsWith("+")) {
          data.cell.styles.textColor = [16, 185, 129]; // Emerald Green
        } else {
          data.cell.styles.textColor = [225, 29, 72]; // Rose Red
        }
      }
    },
  });

  // 5. FOOTER LAPORAN
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      "Laporan ini dibuat otomatis oleh ArusKas App • © 2026 Wahyu Sampurno Adi",
      14,
      287
    );
    pdf.text(`Halaman ${i} dari ${pageCount}`, 196, 287, { align: "right" });
  }

  // SIMPAN FILE
  pdf.save(`Laporan-ArusKas-${month + 1}-${year}.pdf`);
};