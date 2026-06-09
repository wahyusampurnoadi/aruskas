export const exportPDF = () => {
    const pdf = new jsPDF();
  
    pdf.setFontSize(14);
    pdf.text("Laporan Keuangan Bulanan", 14, 15);
  
    pdf.setFontSize(11);
    pdf.text(`Periode: ${month + 1}/${year}`, 14, 23);
  
    autoTable(pdf, {
      startY: 30,
      head: [["Tanggal", "Jenis", "Kategori", "Catatan", "Jumlah"]],
      body: filtered.map((t) => [
        t.transactionDate.seconds 
        ? t.transactionDate.toDate().toLocaleDateString("id-ID") 
        : new Date(t.transactionDate).toLocaleDateString("id-ID"),
      t.type === "income" ? "Pemasukan" : "Pengeluaran",
        t.category,
        t.note || "-",
        `Rp ${t.amount.toLocaleString("id-ID")}`,
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [30, 64, 175], // biru
        textColor: 255,
        halign: "center",
      },
      bodyStyles: {
        textColor: 20,
      },
      columnStyles: {
        4: { halign: "right" },
      },
    });
  
    pdf.save(`Laporan-${month + 1}-${year}.pdf`);
  };