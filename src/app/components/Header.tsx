"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api, { handleApiError } from "../../services/api";
import SweetFormModal from "../components/SweetFormModal";

import type { SweetDto } from "../../types";

type HeaderProps = {
  onSearch?: (val: string, id?: number) => void;
    onAddSweet?: (sweet: SweetDto) => void;  
};

export default function Header({ onSearch,onAddSweet  }: HeaderProps) {
  const router = useRouter();
  const { loggedIn, admin, username, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [results, setResults] = useState<SweetDto[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch dropdown suggestions (local to Header)
  useEffect(() => {
    const fetchResults = async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }
      try {
        const resp = await api.get<SweetDto[]>("/sweets/search", {
          params: { name: search.trim() },
        });
        setResults(resp.data);
      } catch (err) {
        console.error(handleApiError(err));
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleSelect = (sweet: SweetDto) => {
  // Pass selected sweet's name and id
  onSearch?.(sweet.name,sweet.id);
  setSearch("");      // clear search input
  setResults([]);     // clear dropdown
  setDropdownOpen(false);
};


  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-gradient-to-r from-[#42B0D5] to-[#3AAFA9] text-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center shadow-md relative gap-4">
      <Link
        href="/"
        className="font-extrabold text-2xl tracking-wide hover:text-yellow-200 transition-colors"
      >
        SweetShop
      </Link>

      <div className="flex-1 max-w-md relative w-full sm:w-auto" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search sweets..."
          value={search}
          onFocus={() => setDropdownOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setDropdownOpen(true); // show dropdown while typing
          }}
          className="w-full px-4 py-2 rounded-full border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
        />
{dropdownOpen && (
  <div className="absolute top-full mt-2 w-full bg-white text-black rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
    {results.length > 0 ? (
      results.map((sweet) => (
        <div
          key={sweet.id}
          onClick={() => handleSelect(sweet)}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            className="w-10 h-10 object-cover rounded-full"
          />
          <span className="font-medium">{sweet.name}</span>
        </div>
      ))
    ) : search.trim().length > 0 ? (
      <div className="px-4 py-2 text-gray-500 italic">No items found</div>
    ) : null}
  </div>
)}


      </div>

      {/* User Menu */}
      <nav className="flex items-center space-x-4">
        {loggedIn ? (
          <>
            {admin && (
            <button
                onClick={() => setModalOpen(true)}
                className="hover:text-yellow-200 font-medium transition-colors"
              >
                + Add Sweet
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-white text-[#42B0D5] flex items-center justify-center font-bold focus:outline-none shadow hover:scale-105 transition-transform"
              >
                {username.charAt(0).toUpperCase()}
              </button>
            </div>
            <button onClick={handleLogout} className="hover:text-yellow-200">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-yellow-200 transition-colors">
              Login
            </Link>
            <Link href="/register" className="hover:text-yellow-200 transition-colors">
              Register
            </Link>
          </>
        )}
      </nav>

        {/* SweetFormModal for adding new sweets */}    
         <SweetFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAdd={(newSweet) => {
          onAddSweet?.(newSweet);   // 👈 call parent callback
        }}
      />
    </header>
  );
}
