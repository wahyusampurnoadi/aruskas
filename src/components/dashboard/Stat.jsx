export default function Stat({ title, value, color, highlight }) {
    return (
      <div className={`p-5 rounded-2xl ${highlight ? "bg-gradient-to-r from-blue-600 to-indigo-700" : "bg-white/5"}`}>
        <p className="text-sm">{title}</p>
        <h3
          className={`text-2xl font-bold ${
            color === "green"
              ? "text-green-400"
              : color === "red"
              ? "text-red-400"
              : ""
          }`}
        >
          Rp {value.toLocaleString("id-ID")}
        </h3>
      </div>
    );
  }