"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cms/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Invalid email or password.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  return (
    <div className="min-h-screen bg-[#050505] flex">

      {/* ── Left panel — brand ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-14"
      >
        {/* Layered background */}
        <div className="absolute inset-0 bg-[#080808]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 80%, rgba(217,134,41,0.13) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(217,134,41,0.06) 0%, transparent 50%)",
          }}
        />
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Vertical amber accent line */}
        <div
          className="absolute right-0 top-0 bottom-0 w-px"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(217,134,41,0.25), transparent)" }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <Image src="/logo.webp" alt="Movico" width={52} height={52} className="object-contain" />
            <div>
              <p
                className="text-white font-black text-xl tracking-[0.22em] uppercase leading-none"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                MOVICO
              </p>
              <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mt-1">
                Content Studio
              </p>
            </div>
          </div>
        </div>

        {/* Center quote */}
        <div className="relative z-10 max-w-sm">
          <div
            className="w-8 h-[2px] mb-8"
            style={{ background: "#d98629" }}
          />
          <p
            className="text-white text-3xl font-black leading-[1.1] uppercase tracking-tight mb-6"
            style={{ fontFamily: "Satoshi, sans-serif" }}
          >
            Every frame
            <br />
            <span style={{ color: "#d98629" }}>tells a story.</span>
          </p>
          <p className="text-white/35 text-sm leading-relaxed">
            Manage your content, control your brand, and keep
            your story consistent — all from one place.
          </p>
        </div>

        {/* Bottom meta */}
        <div className="relative z-10">
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-white/20">
            <span>Riyadh</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Saudi Arabia</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>GCC</span>
          </div>
        </div>
      </motion.div>

      {/* ── Right panel — form ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="flex-1 flex flex-col items-center justify-center px-8 py-16 relative"
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-12 text-center">
          <Image src="/logo.webp" alt="Movico" width={56} height={56} className="object-contain mx-auto mb-3" />
          <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Content Studio</p>
        </div>

        <div className="w-full max-w-[380px]">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-10"
          >
            <h1
              className="text-white font-black text-3xl leading-tight uppercase tracking-tight mb-2"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Sign in
            </h1>
            <p className="text-white/35 text-sm">
              Admin access · Movico CMS
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            onSubmit={handleSubmit}
            className="space-y-7"
          >
            {/* Email */}
            <div className="group">
              <label className="block text-[10px] uppercase tracking-[0.22em] text-white/30 mb-3 group-focus-within:text-[#d98629] transition-colors duration-200">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@movico.com"
                className="cms-input w-full bg-transparent border-b border-white/15 text-white text-sm py-3 placeholder:text-white/15 focus:outline-none focus:border-[#d98629] transition-colors duration-200"
                style={{ caretColor: "#d98629" }}
                required
                autoFocus
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-[10px] uppercase tracking-[0.22em] text-white/30 mb-3 group-focus-within:text-[#d98629] transition-colors duration-200">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="cms-input w-full bg-transparent border-b border-white/15 text-white text-sm py-3 pr-10 placeholder:text-white/15 focus:outline-none focus:border-[#d98629] transition-colors duration-200"
                  style={{ caretColor: "#d98629" }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-[12px] text-red-400/80"
                >
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-[0.2em] py-4 rounded-full transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: canSubmit ? "#d98629" : "#222",
                color: canSubmit ? "#000" : "#555",
                boxShadow: canSubmit ? "0 0 40px rgba(217,134,41,0.35)" : "none",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-[10px] text-white/15 mt-12 uppercase tracking-[0.2em]"
          >
            Protected · Movico CMS
          </motion.p>
        </div>
      </motion.div>

      {/* Fix browser autofill blue background */}
      <style>{`
        .cms-input:-webkit-autofill,
        .cms-input:-webkit-autofill:hover,
        .cms-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff;
          -webkit-box-shadow: 0 0 0 1000px #050505 inset;
          transition: background-color 5000s ease-in-out 0s;
          caret-color: #d98629;
        }
      `}</style>
    </div>
  );
}
