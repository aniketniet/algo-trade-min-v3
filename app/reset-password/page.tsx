"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Key, Eye, EyeOff, ArrowRight } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Component that uses useSearchParams
function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Enter code, 2: Enter new password
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api'}/auth/verify-reset-code`, {
        email: email,
        resetCode: resetCode
      });

      if (response.data.success) {
        setStep(2);
        setMessage("Code verified successfully. Now enter your new password.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api'}/auth/reset-password`, {
        email: email,
        resetCode: resetCode,
        newPassword: newPassword
      });

      if (response.data.success) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/forgot-password" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Reset Password Card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {step === 1 ? "Enter Verification Code" : "Set New Password"}
              </h1>
              <p className="text-slate-600 text-sm">
                {step === 1 
                  ? "Enter the 6-digit code sent to your email address."
                  : "Create a strong password for your account."
                }
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  1
                </div>
                <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  2
                </div>
              </div>
            </div>

            {/* Form */}
            {step === 1 ? (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                {/* Email Field (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="h-11 border-slate-300 bg-slate-50 text-slate-600"
                  />
                </div>

                {/* Reset Code Field */}
                <div className="space-y-2">
                  <Label htmlFor="resetCode" className="text-sm font-medium text-slate-700">
                    Verification Code
                  </Label>
                  <Input
                    id="resetCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors text-center text-lg tracking-widest"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {message && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">{message}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || resetCode.length !== 6}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="h-11 border-slate-300 bg-white pr-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-11 border-slate-300 bg-white pr-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {message && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">{message}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Remember your password?{" "}
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              {step === 1 
                ? "Didn't receive the code? Check your spam folder or request a new one."
                : "Make sure your password is strong and secure."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/forgot-password" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </Link>
      </div>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
