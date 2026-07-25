export default function Avatar({ name }) {
    const initial = name?.charAt(0)?.toUpperCase() || "?";
    return (
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
        {initial}
      </div>
    );
  }