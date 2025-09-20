"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api, { handleApiError } from "../../services/api";
import { AuthRequest } from "../../types";
import { useAuthRedirect } from "@/context/AuthRedirect";

export default function RegisterPage() {
  useAuthRedirect(); // Redirect if already logged in
  const [form, setForm] = useState<AuthRequest & { admin?: boolean }>({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 
    setSuccess("");
    try {
      await api.post("/auth/register", form);
      setSuccess("User created successfully");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgba(247,247,247,1)] p-4">
      <div className="max-w-md w-full bg-gray-50 shadow-md rounded-lg p-8 hover:bg-gray-100 transition duration-300">
        <h1 className="text-3xl font-bold mb-6 text-[rgba(66,176,213,1)] text-center">
          Register
        </h1>

        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-center">{success}</div>}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[rgba(66,176,213,1)] text-black"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[rgba(66,176,213,1)] text-black"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full p-3 bg-[rgba(66,176,213,1)] text-white font-semibold rounded hover:bg-[rgba(55,150,180,1)] transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
