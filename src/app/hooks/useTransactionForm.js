"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function useTransactionForm() {
  const [editingId, setEditingId] = useState(null);

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [selectedGoalId, setSelectedGoalId] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [uploading, setUploading] = useState(false);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) {
      setAmount("");
      return;
    }

    setAmount(new Intl.NumberFormat("id-ID").format(value));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire(
        "File terlalu besar",
        "Ukuran maksimal 2 MB",
        "error"
      );
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingId(null);
    setType("income");
    setAmount("");
    setCategory("");
    setNote("");
    setSelectedGoalId("");
    setImageFile(null);
    setImagePreview("");
    setExistingImageUrl("");
    setTransactionDate(new Date().toISOString().split("T")[0]);
  };

  const loadTransaction = (transaction) => {
    setEditingId(transaction.id);
    setType(transaction.type);
    setAmount(
      new Intl.NumberFormat("id-ID").format(transaction.amount || 0)
    );
    setCategory(transaction.category || "");
    setNote(transaction.note || "");
    setSelectedGoalId(transaction.wishlistGoalId || "");

    setExistingImageUrl(transaction.imageUrl || "");
    setImagePreview(transaction.imageUrl || "");
    setImageFile(null);

    if (transaction.transactionDate) {
      const d = transaction.transactionDate.toDate
        ? transaction.transactionDate.toDate()
        : new Date(transaction.transactionDate);

      setTransactionDate(d.toISOString().split("T")[0]);
    }
  };

  return {
    editingId,
    setEditingId,

    type,
    setType,

    amount,
    setAmount,

    category,
    setCategory,

    note,
    setNote,

    transactionDate,
    setTransactionDate,

    selectedGoalId,
    setSelectedGoalId,

    imageFile,
    setImageFile,

    imagePreview,
    setImagePreview,

    existingImageUrl,
    setExistingImageUrl,

    uploading,
    setUploading,

    handleAmountChange,
    handleFileUpload,

    resetForm,
    loadTransaction,
  };
}