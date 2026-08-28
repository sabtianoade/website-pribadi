"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions";
import { Lock, Loader2, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("password", password);

    const result = await loginAction(formData);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Terjadi kesalahan");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[var(--card)] border border-[var(--card-border)] shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-[var(--primary)]/20 shadow-inner">
            <Lock className="w-8 h-8 text-[var(--primary)]" />
          </div>
          
          <h1 className="text-2xl font-black text-center mb-2 text-[var(--foreground)]">Admin Access</h1>
          <p className="text-center text-[var(--muted)] text-sm mb-8">
            Hanya Thomas yang boleh masuk!
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password Rahasia"
                className="w-full bg-[var(--background)] border border-[var(--card-border)] focus:border-[var(--primary)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none transition-all text-center"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[var(--foreground)] text-[var(--background)] font-bold py-3.5 rounded-xl shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Masuk <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
