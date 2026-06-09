import Toggle from "@/components/dashboard/Toggle";

export default function TransactionForm({
  formRef,
  submit,
  editingId,
  type,
  setType,
  transactionDate,
  setTransactionDate,
  amount,
  handleAmountChange,
  category,
  setCategory,
  note,
  setNote,
  handleFileUpload,
  imageFile,
  uploading,
}) {
  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className={`transition-all duration-500 ${
        editingId
          ? "ring-2 ring-blue-500 bg-blue-500/5"
          : "bg-white/5"
      } p-6 rounded-2xl space-y-3 flex flex-col`}
    >
      <h2 className="font-semibold text-lg">
        {editingId ? "Edit" : "Tambah"} Transaksi
      </h2>

      <div className="flex gap-2">
        <Toggle
          active={type === "income"}
          onClick={() => setType("income")}
          label="Pemasukan"
        />

        <Toggle
          active={type === "expense"}
          onClick={() => setType("expense")}
          label="Pengeluaran"
        />
      </div>

      <input
        type="date"
        value={transactionDate}
        onChange={(e) => setTransactionDate(e.target.value)}
        className="
          w-full p-3 rounded-xl bg-black/40 border border-white/10
          text-white cursor-pointer outline-none
          focus:ring-2 focus:ring-blue-500/50
          scheme-dark
        "
      />

      <input
        type="text"
        placeholder="Jumlah (Rp)"
        value={amount}
        onChange={handleAmountChange}
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10
        text-white outline-none
        focus:ring-2 focus:ring-blue-500/50
        scheme-dark"
      />

      <input
        placeholder="Kategori"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10
        text-white outline-none
        focus:ring-2 focus:ring-blue-500/50
        scheme-dark"
      />

      <textarea
        placeholder="Catatan"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10
        text-white outline-none
        focus:ring-2 focus:ring-blue-500/50
        scheme-dark"
      />

      <div className="space-y-2">
        <label className="text-xs text-gray-400 ml-1">
          Bukti Transaksi (Opsional)
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="
            w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-xl file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600/20 file:text-blue-400
            hover:file:bg-blue-600/30
            cursor-pointer bg-black/40 rounded-xl p-2
          "
        />

        {imageFile && (
          <p className="text-[10px] text-green-400 ml-1">
            ✔ {imageFile.name} siap diunggah
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="
          mt-auto w-full p-3 rounded-xl
          bg-blue-600 hover:bg-blue-700
          font-semibold cursor-pointer
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition-all
        "
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Menyimpan...
          </span>
        ) : editingId ? (
          "Update Transaksi"
        ) : (
          "Simpan Transaksi"
        )}
      </button>
    </form>
  );
}