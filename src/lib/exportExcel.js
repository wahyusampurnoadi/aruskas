import * as XLSX from "xlsx";

export const exportExcel = (
  transactions,
  month,
  year
) => {
  const data = transactions.map((t, i) => ({
    No: i + 1,
    Tanggal: t.transactionDate
      ?.toDate()
      ?.toLocaleDateString("id-ID"),
    Jenis: t.type,
    Kategori: t.category,
    Catatan: t.note || "-",
    Jumlah: t.amount,
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Laporan"
  );

  XLSX.writeFile(
    wb,
    `Laporan-${month + 1}-${year}.xlsx`
  );
};