
"use client";

import { SweetDto } from "../../../types";
import { useState ,useEffect} from "react";
import api, { handleApiError } from "../../../services/api";
import { isAdmin } from "../../../utils/auth";
import { useRouter } from "next/navigation";
import SweetUpdateModal from "@/app/components/SweetUpdateModal";

export default function SweetCard({
  sweet,
  onDelete,
  onUpdate,
}: {
  sweet: SweetDto;
  onDelete?: (id: number) => void;
  onUpdate?: (sweet: SweetDto) => void; 
}) {
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showUpdate, setShowUpdate] = useState(false);


  // ✅ create local state for sweet
  const [localSweet, setLocalSweet] = useState<SweetDto>(sweet);

  useEffect(() => {
  setLocalSweet(sweet);
}, [sweet]);

  const router = useRouter();

  const increaseQty = () => {
    if (quantity < localSweet.quantity) {
      setQuantity(quantity + 1);
      setError("");
    } else {
      setError(`Only ${localSweet.quantity} items are in stock`);
    }
  };

  const decreaseQty = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      setError("");
    }
  };

  const purchase = async () => {
    setError("");
    if (localSweet.quantity === 0) {
      setError("This item is out of stock");
      return;
    }
    if (quantity === 0) {
      setError("Please select a quantity before purchasing");
      return;
    }

    try {
      await api.post(`/sweets/${localSweet.id}/purchase`, { quantity });
      alert("Purchased successfully");

      // ✅ update localSweet immediately without refresh
      setLocalSweet((prev) => ({
        ...prev,
        quantity: prev.quantity - quantity,
      }));

      setQuantity(1); // reset selected quantity
    } catch (err) {
      setError(handleApiError(err));
    }
  };

    const deleteSweet = async () => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/sweets/${localSweet.id}`);
      alert("Deleted successfully");
      if (onDelete && localSweet.id !== undefined) onDelete(localSweet.id); // ✅ remove from parent state
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:scale-[1.02] overflow-hidden">
      <div className="h-40 bg-gradient-to-r from-pink-200 to-yellow-200 flex items-center justify-center text-gray-600 text-lg font-semibold">
        🍩 {localSweet.name}
      </div>
       {/* Out of Stock Badge */}
  {localSweet.quantity === 0 && (
    // <div className="relative bg-white rounded-xl shadow hover:shadow-lg transition transform hover:scale-[1.02] overflow-hidden">

   <div className="relative text-center bg-red-100 text-red-700  font-bold py-1 shadow-md">
  OUT OF STOCK
</div>

  )}





      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="font-extrabold text-lg text-gray-800">
            {localSweet.name}
          </h2>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
            ⭐ {Math.floor(Math.random() * 2) + 4}.0
          </span>
        </div>
        <p className="text-gray-500 text-sm">Category: {localSweet.category}</p>

    
        <p className="text-pink-600 font-semibold">₹{localSweet.price}</p>
        <p className="text-gray-600">Available: {localSweet.quantity}</p>

        {/* Quantity Selector */}
        <div className="flex items-center mt-3 space-x-3">
          <button
            onClick={decreaseQty}
            className="px-3 py-1 bg-gray-200 text-black font-bold rounded-full disabled:opacity-50"
            disabled={quantity === 0}
          >
            -
          </button>
          <span className="font-semibold text-lg text-black">{quantity}</span>
          <button
            onClick={increaseQty}
            className="px-3 py-1 bg-gray-200 text-black font-bold rounded-full disabled:opacity-50"
            disabled={quantity >= localSweet.quantity}
          >
            +
          </button>
        </div>

       {/* Buttons */}
<div className="mt-4 flex flex-col gap-2 w-full">
  <button
    onClick={purchase}
    disabled={localSweet.quantity === 0 || quantity === 0}
    className={`w-[calc(100%-10px)] mx-auto px-4 py-2 rounded-lg text-black font-semibold shadow-md transition ${
      localSweet.quantity === 0 || quantity === 0
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[rgb(120,200,226)] hover:bg-[rgb(66,176,213)]"
    }`}
  >
    Purchase
  </button>

  {isAdmin() && (
    <>
      <button
            onClick={() => onUpdate?.(localSweet)}  // ✅ call parent handler
            className="w-[calc(100%-10px)] mx-auto px-4 py-2 rounded-lg border-black bg-white hover:bg-[rgb(216,239,247)] text-black font-semibold shadow-md"
          >
        Update
      </button>
      <button
        onClick={deleteSweet}
        className="w-[calc(100%-10px)] mx-auto px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md"
      >
        Delete
      </button>
    </>
  )}

</div>


        {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
      </div>
    </div>
  );
}
