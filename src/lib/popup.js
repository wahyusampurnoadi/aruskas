import Swal from "sweetalert2";

const ACCENT = {
  success: "#10b981",
  error: "#f43f5e",
  warning: "#f59e0b",
  info: "#06b6d4",
};

/**
 * Popup kustom ArusKas.
 * type: "success" | "error" | "warning" | "info"
 */
export function showPopup({ type = "info", title, text = "", confirmText = "Oke" }) {
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return Swal.fire({
    icon: type,
    title,
    text,
    confirmButtonText: confirmText,
    buttonsStyling: false,
    background: isDark ? "rgba(15, 23, 42, 0.82)" : "rgba(255, 255, 255, 0.92)",
    color: isDark ? "#f1f5f9" : "#0f172a",
    backdrop: isDark ? "rgba(2, 6, 23, 0.55)" : "rgba(15, 23, 42, 0.22)",
    iconColor: ACCENT[type],
    showClass: { popup: "animate__animated" },
    customClass: {
      popup: "aruskas-popup aruskas-backdrop",
      title: "aruskas-title",
      htmlContainer: "aruskas-text",
      actions: "aruskas-actions",
      confirmButton: "aruskas-confirm",
    },
  });
}