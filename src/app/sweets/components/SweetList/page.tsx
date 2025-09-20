"use client";

import { useEffect, useState } from "react";
import api, { handleApiError } from "../../../../services/api";
import { SweetDto } from "../../../../types";
import SweetCard from "@/app/sweets/components/SweetCard";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useAuthRedirect } from "../../../../context/AuthRedirect";
import FilterBar from "@/app/components/FilterBar";
import SweetUpdateModal from "@/app/components/SweetUpdateModal"; // ✅ Import modal

export default function HomePage() {
  useAuthRedirect();
  const [sweets, setSweets] = useState<SweetDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [sweetToUpdate, setSweetToUpdate] = useState<SweetDto | null>(null); // ✅ Track selected sweet
  const [activeFilters, setActiveFilters] = useState<Record<string, string | number>>({});
  
  // ✅ handle applied filters from FilterBar
const handleApplyFilters = (filters: Record<string, string | number>) => {
  setActiveFilters(filters);
  console.log("Filters applied:", filters);
  // TODO: call fetchSweets with filters (API should support it)
  fetchSweets(filters);
};

// ✅ remove single filter chip
const handleRemoveFilter = (key: string) => {
  const newFilters = { ...activeFilters };
  delete newFilters[key];
  setActiveFilters(newFilters);
  fetchSweets(newFilters);
};
const fetchSweets = async (filters?: Record<string, string | number>) => {
  setLoading(true);
  setError("");
  try {
    const resp = filters
      ? await api.get<SweetDto[]>("/sweets/filter", { params: filters })
      : await api.get<SweetDto[]>("/sweets");

    setSweets(resp.data);
  } catch (err) {
    setError(handleApiError(err));
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchSweets(activeFilters);
  }, [activeFilters]);

  // Scroll and highlight sweet
  const handleSearchSelect = (val: string, sweetId?: number) => {
    if (sweetId) {
      setHighlightedId(sweetId);
      setTimeout(() => {
        const element = document.getElementById(`sweet-${sweetId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      setHighlightedId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#42B0D5]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* ✅ Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Header
          onSearch={handleSearchSelect}
          onAddSweet={(newSweet) => setSweets((prev) => [...prev, newSweet])}
        />
      </div>

      {/* ✅ Main Content */}
      <div className="pt-24 p-4 sm:p-6 bg-[#F9FAFB] min-h-screen">
        {/* Filter */}
        <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap justify-center mt-20">
          <FilterBar
            onApply={handleApplyFilters} 
          />
          {/* Active Filters */}
{Object.keys(activeFilters).length > 0 && (
  <div className="flex flex-wrap gap-2 mb-6 justify-center">
    {Object.entries(activeFilters).map(([key, value]) => (
      <div
        key={key}
        className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full"
      >
        <span className="text-sm font-medium capitalize">
          {key}: {value}
        </span>
        <button
          className="text-pink-600 hover:text-pink-800"
          onClick={() => handleRemoveFilter(key)}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}

        </div>

        {/* Sweet Cards */}
        {sweets.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            onMouseEnter={() => setHighlightedId(null)}
          >
            {sweets.map((s) => (
              <div
                key={s.id}
                id={`sweet-${s.id}`}
                className={`transform transition duration-300 hover:scale-105 cursor-pointer p-1 rounded ${
                  highlightedId === s.id ? "ring-4 ring-pink-400" : ""
                }`}
              >
                <SweetCard
                  sweet={s}
                  onDelete={(id: number) =>
                    setSweets((prev) => prev.filter((sw) => sw.id !== id))
                  }
                  onUpdate={(sweet) => setSweetToUpdate(sweet)} // ✅ open modal
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg font-medium mt-12">
            No sweets found 🍩
          </div>
        )}
      </div>

      {/* ✅ Sweet Update Modal */}
    {sweetToUpdate && (
        <SweetUpdateModal
          sweet={sweetToUpdate}
          onClose={() => setSweetToUpdate(null)}
          onUpdated={(updated) =>
            setSweets((prev) =>
              prev.map((sw) => (sw.id === updated.id ? updated : sw))
            )
          }
        />
      )}

      {/* ✅ Footer */}
      <Footer />

        
    </>
  );
}
