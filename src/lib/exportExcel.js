import * as XLSX from "xlsx";

export const exportExcel = (transactions, month, year) => {
  // 1. HITUNG RINGKASAN DATA
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  // Nama Bulan dalam Bahasa Indonesia
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const monthName = monthNames[month] || `${month + 1}`;

  // 2. STRUKTUR HEADER & SUMMARY LAPORAN
  const sheetData = [
    ["ARUSKAS - FINANCIAL MANAGEMENT SYSTEM"],
    [`Laporan Keuangan Bulanan - Periode: ${monthName} ${year}`],
    [`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`],
    [], // Baris kosong
    ["RINGKASAN FINANSIAL"],
    ["Total Pemasukan", totalIncome],
    ["Total Pengeluaran", totalExpense],
    ["Selisih / Net", netBalance],
    [], // Baris kosong
    // Header Tabel Transaksi
    ["No", "Tanggal", "Jenis", "Kategori", "Catatan", "Jumlah (Rp)"]
  ];

  // 3. MAP DATA TRANSAKSI
  transactions.forEach((t, i) => {
    // Format Tanggal Aman
    let formattedDate = "-";
    if (t.transactionDate?.toDate) {
      formattedDate = t.transactionDate.toDate().toLocaleDateString("id-ID");
    } else if (t.transactionDate?.seconds) {
      formattedDate = new Date(t.transactionDate.seconds * 1000).toLocaleDateString("id-ID");
    } else if (t.transactionDate) {
      formattedDate = new Date(t.transactionDate).toLocaleDateString("id-ID");
    }

    sheetData.push([
      i + 1,
      formattedDate,
      t.type === "income" ? "Pemasukan" : "Pengeluaran",
      t.category || "-",
      t.note || "-",
      Number(t.amount || 0)
    ]);
  });

  // 4. BUAT WORKSHEET & WORKBOOK
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Format Angka Rupiah pada Kolom Jumlah & Ringkasan
  const currencyFormat = "Rp #,##0";
  
  // Apply format Rupiah pada Summary (B6, B7, B8)
  ["B6", "B7", "B8"].forEach((cell) => {
    if (ws[cell]) ws[cell].z = currencyFormat;
  });

  // Apply format Rupiah pada Baris Transaksi (Kolom F)
  const startRow = 11; // Baris data transaksi dimulai
  transactions.forEach((_, idx) => {
    const cellRef = `F${startRow + idx}`;
    if (ws[cellRef]) ws[cellRef].z = currencyFormat;
  });

  // 5. SETTING AUTO LEBAR KOLOM (Auto-Fit Column Width)
  const colWidths = [
    { wch: 6 },  // No
    { wch: 15 }, // Tanggal
    { wch: 15 }, // Jenis
    { wch: 20 }, // Kategori
    { wch: 35 }, // Catatan
    { wch: 20 }  // Jumlah
  ];
  ws["!cols"] = colWidths;

  // 6. SIMPAN FILE
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan ArusKas");

  XLSX.writeFile(wb, `Laporan-ArusKas-${monthName}-${year}.xlsx`);
};