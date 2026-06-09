export default function Toggle({ active, onClick, label }) {
    const isIncome = label === "Pemasukan";
  
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          flex-1 p-3 rounded-xl cursor-pointer font-semibold transition
          ${
            active
              ? isIncome
                ? "bg-green-500/30 text-green-400 ring-1 ring-green-500/40"
                : "bg-red-500/30 text-red-400 ring-1 ring-red-500/40"
              : "bg-black/40 text-gray-300 hover:bg-white/10"
          }
        `}
      >
        {label}
      </button>
    );
  }