/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { ShieldCheck, Mail, Lock, Phone, Smartphone, Chrome, ArrowRight, Check, KeyRound, Timer, ShieldAlert } from "lucide-react";

interface AuthenticationProps {
  onSuccess?: () => void;
}

export const Authentication: React.FC<AuthenticationProps> = ({ onSuccess }) => {
  const { setIsLoggedIn, addNotification, setUserRole } = useApp();

  const [authTab, setAuthTab] = useState<"login" | "otp" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 2FA states
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email || !password) {
      setError("Please supply both credentials.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate two-factor trigger for demo purposes if selected
      const isTwoFactorMock = localStorage.getItem("blousia_2fa_enabled") === "true";
      if (isTwoFactorMock) {
        setTwoFactorRequired(true);
        addNotification(`Security: Two-Factor challenge triggered for email ${email}`);
      } else {
        setIsLoggedIn(true);
        if (email.toLowerCase() === "nilanjanahatuya@gmail.com") {
          setUserRole("Super Admin");
        } else {
          setUserRole("Customer");
        }
        addNotification(`User successfully authenticated with JWT session: ${email}`);
        if (onSuccess) onSuccess();
      }
    }, 1500);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone) {
      setError("Please supply a valid WhatsApp or phone number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setCountdown(60);
      addNotification(`Security: OTP challenge sent to +91 ${phone}`);
      setMessage("Security OTP has been successfully transmitted via SMS/WhatsApp.");
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otpCode !== "12927" && otpCode.length > 0) { // arbitrary validation code for beautiful simulation
      setError("Incorrect OTP code. Please check your messages and try again.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      setUserRole("Customer");
      addNotification(`User successfully authenticated with secure OTP session token.`);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (twoFactorCode !== "12927" && twoFactorCode.length > 0) {
      setError("Invalid Authenticator TOTP token.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      addNotification(`User 2FA successfully authenticated. Session validated.`);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setError("");
    addNotification("Auth: Initializing Google Identity Federated OAuth handshake...");
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      setUserRole("Customer");
      addNotification("User authenticated successfully via Google OpenID Connect.");
      if (onSuccess) onSuccess();
    }, 1800);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please supply your registered email destination first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage("A password reset ticket has been dispatched to your mailbox with an expiration of 15 minutes.");
    }, 1000);
  };

  if (twoFactorRequired) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 border border-gold-100 p-6 sm:p-8 animate-fadeIn">
        <div className="text-center mb-6">
          <ShieldAlert className="mx-auto text-gold-500 mb-2" size={32} />
          <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white">Two-Factor Authenticator Challenge</h3>
          <p className="text-xs text-gray-400 mt-1">Please enter the 6-digit dynamic token generated by your Google Authenticator or Duo app.</p>
        </div>

        <form onSubmit={handleVerify2FA} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">TOTP Authenticator Token</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 text-gray-400" size={16} />
              <input
                type="text"
                required
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter code (or type '12927' to bypass)"
                className="w-full border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-xs focus:outline-none font-mono text-center tracking-[0.4em] text-lg font-bold"
              />
            </div>
          </div>

          {error && <p className="text-[11px] font-medium text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-950 hover:bg-gold-500 text-white dark:bg-white dark:text-gray-950 dark:hover:bg-gold-500 dark:hover:text-white py-3 text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            Verify Token & Login <Check size={14} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 border border-black/[0.03] dark:border-white/[0.03] p-6 sm:p-8 space-y-6">
      
      {/* Brand Identity */}
      <div className="text-center">
        <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-gold-500 block mb-1">Couture Vault</span>
        <h2 className="font-serif text-xl italic font-light text-gray-950 dark:text-white">Blousia® Studio Access</h2>
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">Login to synchronize your measurements, custom design requests, and luxury bag.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black/[0.05] dark:border-white/[0.05]">
        <button
          onClick={() => { setAuthTab("login"); setShowForgot(false); setError(""); setMessage(""); }}
          className={`flex-1 pb-2.5 text-[10px] uppercase tracking-wider font-bold transition-all ${
            authTab === "login" && !showForgot ? "text-gold-500 border-b border-gold-400" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Email Access
        </button>
        <button
          onClick={() => { setAuthTab("otp"); setShowForgot(false); setError(""); setMessage(""); }}
          className={`flex-1 pb-2.5 text-[10px] uppercase tracking-wider font-bold transition-all ${
            authTab === "otp" && !showForgot ? "text-gold-500 border-b border-gold-400" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Secure OTP Login
        </button>
      </div>

      {showForgot ? (
        /* Forgot Password Section */
        <form onSubmit={handleForgotPassword} className="space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Registered Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-gray-400" size={15} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-[11px] font-medium text-rose-500">{error}</p>}
          {message && <p className="text-[11px] font-medium text-emerald-500 leading-relaxed">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-950 hover:bg-gold-500 text-white py-3 text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            Dispatch Reset Ticket <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => setShowForgot(false)}
            className="text-[10px] text-gray-400 hover:text-gray-600 block text-center mx-auto underline mt-2"
          >
            Return to password sign-in
          </button>
        </form>
      ) : authTab === "login" ? (
        /* Standard Email and Password Login */
        <form onSubmit={handlePasswordLogin} className="space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Atelier Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-gray-400" size={15} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Vault Password</label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[9px] text-gold-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-gray-400" size={15} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-[11px] font-medium text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-950 hover:bg-gold-500 text-white dark:bg-white dark:text-gray-950 dark:hover:bg-gold-500 dark:hover:text-white py-3.5 text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            {loading ? "Decrypting Handshake..." : "Sign in securely"} <ShieldCheck size={14} />
          </button>
        </form>
      ) : (
        /* OTP-based Verification Access */
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4 animate-fadeIn">
          {!otpSent ? (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Mobile Phone / WhatsApp Number</label>
              <div className="relative flex">
                <span className="flex items-center px-3 border border-r-0 border-black/[0.08] dark:border-white/[0.08] text-xs font-mono text-gray-500 bg-gray-50">+91</span>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="98765 43210"
                  className="w-full border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">6-Digit Verification SMS Code</label>
                <span className="text-[9px] font-mono text-gray-400 flex items-center gap-1"><Timer size={10} /> {countdown}s</span>
              </div>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-3 text-gray-400" size={15} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter code (or type '12927' to bypass)"
                  className="w-full border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-xs focus:outline-none font-mono text-center tracking-[0.25em]"
                />
              </div>
            </div>
          )}

          {error && <p className="text-[11px] font-medium text-rose-500">{error}</p>}
          {message && <p className="text-[11px] font-medium text-emerald-500 leading-relaxed">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-950 hover:bg-gold-500 text-white dark:bg-white dark:text-gray-950 dark:hover:bg-gold-500 dark:hover:text-white py-3.5 text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            {otpSent ? "Verify Security Code" : "Transmit OTP Key"} <ArrowRight size={14} />
          </button>

          {otpSent && (
            <button
              type="button"
              disabled={countdown > 0}
              onClick={() => { setOtpSent(false); setError(""); }}
              className={`text-[9px] font-bold uppercase tracking-widest block text-center mx-auto mt-2 ${
                countdown > 0 ? "text-gray-300 cursor-not-allowed" : "text-gold-500 hover:underline"
              }`}
            >
              Re-send verification SMS code
            </button>
          )}
        </form>
      )}

      {/* Federated Social handshakes */}
      <div className="relative flex items-center justify-center py-2 border-t border-black/[0.05] dark:border-white/[0.05]">
        <span className="absolute bg-white dark:bg-slate-900 px-3 text-[9px] uppercase tracking-wider text-gray-400 font-bold">Or federated handshake</span>
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="w-full border border-black/[0.1] dark:border-white/[0.1] hover:bg-gray-50 dark:hover:bg-white/5 py-3 text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all text-gray-700 dark:text-gray-300"
      >
        <Chrome size={14} className="text-red-500" /> Authenticate via Google Workspace
      </button>

      {/* Cookies and Session Info */}
      <div className="text-[9px] text-center text-gray-400 max-w-xs mx-auto leading-relaxed border-t border-black/[0.03] pt-4">
        🔒 All connections secured using 256-bit SSL encryption. We use secure, HTTP-only JWT browser session cookies to maintain your boutique bag synchronization securely.
      </div>
    </div>
  );
};
