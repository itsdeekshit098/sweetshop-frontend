"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api, { handleApiError } from "../../services/api";
import { AuthRequest, AuthResponse } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useAuthRedirect } from "@/context/AuthRedirect";

export default function LoginPage() {
  useAuthRedirect(); // Redirect if already logged in
  const [form, setForm] = useState<AuthRequest>({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const resp = await api.post<AuthResponse>("/auth/login", form);
    //   setToken(resp.data.accessToken);
      login(resp.data.accessToken); 
      router.push("/sweets/components/SweetList");
    //   setLoggedIn(true);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[rgba(247,247,247,1)] p-4">
//   <div className="max-w-md w-full bg-gray-50 shadow-md rounded-lg p-8 hover:bg-gray-100 transition  duration-300">
//     <h1 className="text-3xl font-bold mb-6 text-[rgba(66,176,213,1)] text-center">
//       Login
//     </h1>
//      <p className="mb-8 text-black">
//         to log in as admin use username: alice and passwd:alice123
//       </p>
//       <p className="mb-8 text-black">
//         to log in as user use username: hansi and passwd:hansi123
//       </p>
//     {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
//     <form onSubmit={submit} className="space-y-4">
//       <input
//         type="text"
//         placeholder="Username"
//         className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[rgba(66,176,213,1)] text-black"
//         value={form.username}
//         onChange={e => setForm({ ...form, username: e.target.value })}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[rgba(66,176,213,1)] text-black"
//         value={form.password}
//         onChange={e => setForm({ ...form, password: e.target.value })}
//       />
//       <button
//         type="submit"
//         className="w-full p-3 bg-[rgba(66,176,213,1)] text-white font-semibold rounded hover:bg-[rgba(55,150,180,1)] transition"
//       >
//         Login
//       </button>
//     </form>
//   </div>
// </div>

//   );
return (
  <div className="h-screen flex items-center justify-center bg-[rgba(247,247,247,1)]">
    <div className="max-w-md w-full bg-gray-50 shadow-md rounded-lg p-8 hover:bg-gray-100 transition duration-300">
      <h1 className="text-3xl font-bold mb-6 text-[rgba(66,176,213,1)] text-center">
        Login
      </h1>

      <p className="mb-4 text-black text-center">
        <b>admin credentials</b> use: <b>username:</b> <code>alice</code> <b>passwd:</b> <code>alice123</code>
      </p>
      <p></p>
      <p className="mb-8 text-black text-center">
        <b>user credentials</b> use: <b>username:</b> <code>hansi</code> <b>passwd:</b> <code>hansi123</code>
      </p>

      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

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
          Login
        </button>
      </form>
    </div>
  </div>
);

}
