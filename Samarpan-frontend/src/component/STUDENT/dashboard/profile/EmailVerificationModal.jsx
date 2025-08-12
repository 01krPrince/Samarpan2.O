import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, XCircle } from "lucide-react";

export default function EmailVerificationModal({
  open,
  onClose,
  onVerify,
  email,
  loading,
  status,
  error,
  resendOTP,
  resendDisabled
}) {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (open) setOtp("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="relative bg-white border border-gray-200 rounded-xl shadow-xl w-full max-w-sm px-7 py-8 flex flex-col items-center">
        <button className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={onClose} aria-label="Close">
          <XCircle size={22} />
        </button>
        <Mail className="mb-3 text-indigo-700" size={32} />
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Verify your Email</h2>
        <p className="text-sm text-gray-600 text-center mb-3">
          We've sent an OTP to <span className="font-semibold">{email}</span>.
        </p>
        <form onSubmit={e => { e.preventDefault(); onVerify(otp); }}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg tracking-widest text-center mb-2"
            placeholder="Enter 6 digit code"
            value={otp}
            onChange={e => {
              if (/^\d*$/.test(e.target.value) && e.target.value.length <= 6) setOtp(e.target.value);
            }}
            disabled={loading}
          />
          {status === "success" && <div className="flex items-center gap-1 text-green-600 mb-2"><CheckCircle size={18} /> Verified!</div>}
          {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className={`w-full bg-indigo-600 text-white py-2 rounded-md font-semibold transition mt-2 mb-1 cursor-pointer ${(loading || otp.length < 6) ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"}`}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <button
          disabled={loading || resendDisabled}
          onClick={resendOTP}
          className="text-xs text-indigo-600 hover:underline disabled:text-gray-400 mt-2 cursor-pointer"
        >
          {resendDisabled ? "Resend OTP in 30s" : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
