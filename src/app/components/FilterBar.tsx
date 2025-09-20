"use client";

import { useState,useEffect } from "react";
import { X } from "lucide-react";
import api from "../../services/api"; // 👈 adjust path to your axios instance

interface SweetDto {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
}

// interface Props {
//   onApply: (filters: Record<string, string | number>) => void;
// }


interface FilterBarProps {
  onApply: (filters: Record<string, string | number>) => void;
}


export default function FilterBar({ onApply }: FilterBarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"category" | "price" | "rating" | null>(null);
  interface SelectedFilter {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>({});
  const [priceError, setPriceError] = useState("");

  const handleClear = () => {
    setSelectedFilter({});
    setPriceError("");
    setOpen(false);
  };

  const handleApply = () => {
    // ✅ Price validation
    if (selectedFilter.minPrice && selectedFilter.maxPrice) {
      if (selectedFilter.maxPrice <= selectedFilter.minPrice) {
        setPriceError("Max price must be greater than Min price");
        return;
      }
    }

    const finalFilters: Record<string, string | number> = {};

    if (selectedFilter.category) {
      finalFilters.category = selectedFilter.category;
    }
    if (selectedFilter.minPrice && selectedFilter.maxPrice) {
      finalFilters.price = `${selectedFilter.minPrice}-${selectedFilter.maxPrice}`;
    }

    onApply(finalFilters);
    setOpen(false);
    setPriceError("");
  };

  useEffect(() => {
const fetchCategories = async () => {
  console.log("Fetching categories...");
  try {
    const resp = await api.get<SweetDto[]>("/sweets"); // ✅ axios call
    console.log("Response received:", resp);

    const data: SweetDto[] = resp.data;

    // Use a map to track lowercased category for uniqueness
    const uniqueCategoriesMap: Record<string, string> = {};
    data.forEach((sweet) => {
      const key = sweet.category.toLowerCase(); // normalize to lowercase
      if (!uniqueCategoriesMap[key]) {
        uniqueCategoriesMap[key] = sweet.category; // keep original casing
      }
    });

    const uniqueCategories: string[] = Object.values(uniqueCategoriesMap);
    setCategories(uniqueCategories);
  } catch (error) {
    console.error("Failed to fetch sweets:", error);
  }
};

fetchCategories();

  }, []);
  return (
    <>
      {/* Open Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-black bg-white hover:border-[#42B0D5]"
      >
        Filters
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-[700px] h-[500px] rounded-lg shadow-lg flex relative">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>

            {/* Left Section: Filter Types */}
            <div className="w-1/3 border-r p-4 flex flex-col gap-3">
              <h2 className="text-lg font-semibold mb-2 text-black">Filter By</h2>
              <button
                className={`text-left px-3 py-2 rounded text-black ${
                  activeFilter === "category" ? "bg-[#42B0D5] text-black" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveFilter("category")}
              >
                Category
              </button>
              <button
                className={`text-left px-3 py-2 rounded text-black ${
                  activeFilter === "price" ? "bg-[#42B0D5] text-black" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveFilter("price")}
              >
                Price
              </button>
          
            </div>

            {/* Right Section: Dynamic Options */}
            <div className="w-2/3 p-6 overflow-y-auto text-black">
              {activeFilter === "category" && (
                <div>
                  <h3 className="font-medium mb-3">Select Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedFilter({ ...selectedFilter, category: cat })}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedFilter.category === cat
                            ? "bg-[#42B0D5] text-white"
                            : "bg-white text-black hover:border-[#42B0D5]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeFilter === "price" && (
                <div>
                  <h3 className="font-medium mb-3">Enter Price Range</h3>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={selectedFilter.minPrice || ""}
                      onChange={(e) =>
                        setSelectedFilter({
                          ...selectedFilter,
                          minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="w-1/2 border px-3 py-2 rounded text-black"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={selectedFilter.maxPrice || ""}
                      onChange={(e) =>
                        setSelectedFilter({
                          ...selectedFilter,
                          maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="w-1/2 border px-3 py-2 rounded text-black"
                    />
                  </div>
                  {priceError && <p className="text-red-500 text-sm mt-2">{priceError}</p>}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between border-t bg-gray-50">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-[#42B0D5] text-white rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
