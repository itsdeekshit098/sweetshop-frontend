"use client";

import { useState } from "react";
import { SweetDto } from "../../types";
import api, { handleApiError } from "../../services/api";

export default function SweetUpdateModal({
  sweet,
  onClose,
  onUpdated,
}: {
  sweet: SweetDto;
  onClose: () => void;
  onUpdated: (updatedSweet: SweetDto) => void;
}) {
  const [quantity, setQuantity] = useState<string>(""); // start empty
  const [error, setError] = useState("");

  const restock = async () => {
    setError("");

    const qty = Number(quantity); // convert string → number
    if (!qty || qty <= 0) {
      setError("Enter a valid restock quantity");
      return;
    }

    try {
      const resp = await api.post<SweetDto>(`/sweets/${sweet.id}/restock`, {
        quantity: qty,
      });
      onUpdated(resp.data);
      alert("Sweet restocked successfully ✅");
      onClose();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative text-black">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center tracking-wide mb-6">
          Restock Sweet 🍭
        </h2>

        {/* Sweet Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <p className="text-lg">
              <span className="font-semibold">🍬 Name:</span> {sweet.name}
            </p>
            <p className="text-lg">
              <span className="font-semibold">📂 Category:</span> {sweet.category}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-lg">
              <span className="font-semibold">💰 Price:</span> ₹{sweet.price}
            </p>
            <p className="text-lg">
              <span className="font-semibold">📦 Stock:</span> {sweet.quantity}
            </p>
          </div>
        </div>

        {/* Restock input */}
        <div className="mt-4">
          <label className="block font-semibold mb-2 text-lg">
            Restock Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg 
                       bg-white text-black placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-[#42B0D5] transition
                       [&::-webkit-outer-spin-button]:appearance-none 
                       [&::-webkit-inner-spin-button]:appearance-none 
                       [-moz-appearance:textfield]"
            placeholder="Enter quantity..."
          />
        </div>

        {error && (
          <p className="text-red-600 mt-3 font-medium text-center">{error}</p>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 font-semibold text-black transition"
          >
            Cancel
          </button>
          <button
            onClick={restock}
            className="px-6 py-3 rounded-xl bg-[#42B0D5] hover:bg-[#3699B8] text-black font-semibold shadow-md transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
