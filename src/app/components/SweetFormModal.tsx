"use client";

import { useState } from "react";
import api, { handleApiError } from "../../services/api";
import { SweetDto } from "../../types";

export default function SweetFormModal({ isOpen, onClose, onAdd }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (sweet: SweetDto) => void; 
}) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const resp = await api.post<SweetDto>("/sweets", {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      });

      onAdd(resp.data); // ✅ update parent state
      onClose();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-black">Add New Sweet</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            type="text" 
            name="name" 
            placeholder="Sweet Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded text-black"
          />
          <input 
            type="text" 
            name="category" 
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded text-black"
          />
          <input 
            type="number" 
            name="price" 
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded text-black"
          />
          <input 
            type="number" 
            name="quantity" 
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded text-black"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-[#42B0D5] hover:bg-[#3AAFA9] text-white py-2 rounded-lg font-semibold"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
