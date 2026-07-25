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
  setImageFile,
  imagePreview,
  setImagePreview,
  uploading,

  // NEW PROPS
  goals = [],
  selectedGoalId = "",
  setSelectedGoalId = () => { },
}) {
  const incomeCategories = [
    "Gaji",
    "Bonus",
    "Freelance",
    "Penjualan",
    "Investasi",
    "Lainnya",
  ];

  const expenseCategories = [
    "Makan & Minum",
    "Transport",
    "Belanja",
    "Tagihan",
    "Hiburan",
    "Kesehatan",
    "Pendidikan",
    "Wishlist",
    "Lainnya",
  ];

  const handleTypeChange = (nextType) => {
    setType(nextType);

    // reset kategori & target wishlist saat ganti tipe
    setCategory("");
    setSelectedGoalId("");
  };

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className={`transition-all duration-500 ${editingId
        ? "ring-2 ring-blue-500 bg-blue-500/5"
        : "bg-white/5"
        } p-6 rounded-2xl space-y-4 flex flex-col`}
    >
      <h2 className="font-semibold text-lg">
        {editingId ? "Edit" : "Tambah"} Transaksi
      </h2>

      {/* TOGGLE TYPE */}
      <div className="flex gap-2">
        <Toggle
          active={type === "income"}
          onClick={() => handleTypeChange("income")}
          label="Pemasukan"
        />

        <Toggle
          active={type === "expense"}
          onClick={() => handleTypeChange("expense")}
          label="Pengeluaran"
        />
      </div>

      {/* TANGGAL */}
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

      {/* JUMLAH */}
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

      {/* KATEGORI */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">
          Kategori
        </label>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);

            // kalau bukan wishlist, reset target wishlist
            if (e.target.value !== "Wishlist") {
              setSelectedGoalId("");
            }
          }}
          className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="" className="bg-slate-900">
            Pilih kategori
          </option>

          {(type === "income"
            ? incomeCategories
            : expenseCategories
          ).map((item) => (
            <option
              key={item}
              value={item}
              className="bg-slate-900"
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* PILIH TARGET WISHLIST - MUNCUL HANYA SAAT EXPENSE + WISHLIST */}
      {type === "expense" && category === "Wishlist" && (
        <div className="space-y-2">
          <label className="text-sm text-cyan-300 font-medium">
            Pilih Target Wishlist
          </label>

          <select
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="" className="bg-slate-900">
              Pilih wishlist tujuan
            </option>

            {goals.map((goal) => (
              <option
                key={goal.id}
                value={goal.id}
                className="bg-slate-900"
              >
                {goal.name} — Rp{" "}
                {Number(goal.current || 0).toLocaleString("id-ID")} / Rp{" "}
                {Number(goal.target || 0).toLocaleString("id-ID")}
              </option>
            ))}
          </select>

          <p className="text-xs text-cyan-300/80">
            Jika dipilih, nominal pengeluaran ini akan otomatis masuk ke progress wishlist.
          </p>
        </div>
      )}

      {/* CATATAN */}
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

      {/* UPLOAD BUKTI */}
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

        {imagePreview && (
          <div className="mt-4">

            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-72 rounded-xl object-cover border border-white/10"
            />

            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview("");
              }}
              className="mt-3 w-full rounded-xl bg-red-500/15 border border-red-500/20 py-2 text-red-400 hover:bg-red-500/25"
            >
              Hapus Foto
            </button>

          </div>
        )}

        {imageFile && (
          <p className="text-[10px] text-green-400 ml-1">
            ✔ {imageFile.name} siap diunggah
          </p>
        )}
      </div>

      {/* SUBMIT */}
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