"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignupMutation, useLoginMutation } from "@/lib/services/authApi";
import { setAuthSession } from "@/lib/auth/client";
import { extractApiErrorMessage } from "@/lib/utils/extractApiErrorMessage";

interface AuthBoxProps {
  initialMode?: "signup" | "login";
}

export default function AuthBox({ initialMode = "login" }: AuthBoxProps) {
  const router = useRouter();
  const [isSignupMode, setIsSignupMode] = useState(initialMode === "signup");

  // Form input states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup input states
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  useEffect(() => {
    setIsSignupMode(initialMode === "signup");
  }, [initialMode]);

  const switchMode = (signup: boolean) => {
    setIsSignupMode(signup);
    setSignupStatus({ text: "", error: false });
    setLoginStatus({ text: "", error: false });
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", signup ? "/signup" : "/login");
    }
  };

  const [signupMutation, { isLoading: isSigningUp }] = useSignupMutation();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

  const [signupStatus, setSignupStatus] = useState<{ text: string; error: boolean }>({
    text: "",
    error: false,
  });

  const [loginStatus, setLoginStatus] = useState<{ text: string; error: boolean }>({
    text: "",
    error: false,
  });

  const handleQuickDemoFill = () => {
    setLoginEmail("admin@admin.com");
    setLoginPassword("password123");
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginStatus({ text: "", error: false });

    const user = loginEmail.trim();
    const password = loginPassword;

    if (!user || !password) {
      setLoginStatus({ text: "Please enter your email and password.", error: true });
      return;
    }

    try {
      const response = await loginMutation({
        email: user,
        password,
      }).unwrap();

      setAuthSession(response.token, response.user);
      setLoginStatus({ text: "Login successful! Redirecting to your dashboard...", error: false });

      setTimeout(() => {
        router.replace("/");
      }, 800);
    } catch (error) {
      setLoginStatus({
        text: extractApiErrorMessage(error, "Invalid user/email or password."),
        error: true,
      });
    }
  };

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupStatus({ text: "", error: false });

    const user = signupName.trim();
    const email = signupEmail.trim();
    const password = signupPassword;
    const confirmPassword = signupConfirmPassword;

    if (password.length < 6) {
      setSignupStatus({ text: "Password must be at least 6 characters.", error: true });
      return;
    }

    if (password !== confirmPassword) {
      setSignupStatus({ text: "Passwords do not match.", error: true });
      return;
    }

    if (!termsAccepted) {
      setSignupStatus({ text: "Please agree to the Terms of Service to continue.", error: true });
      return;
    }

    try {
      const response = await signupMutation({
        firstName: user,
        lastName: "",
        email,
        password,
        termsAccepted: true,
      }).unwrap();

      if (response?.token) {
        setAuthSession(response.token, response.user);
      }

      setSignupStatus({
        text: "Account created successfully! Redirecting...",
        error: false,
      });

      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } catch (error) {
      setSignupStatus({
        text: extractApiErrorMessage(error, "Signup failed. Please try again."),
        error: true,
      });
    }
  };

  return (
    <div className="auth-modern-page">
      {/* Header Branding */}
      <header className="auth-modern-header">
        <Link href="/" className="auth-modern-logo">
          <img alt="Socimo" src="/images/socimo-logo.png" />
          <span>Socimo</span>
        </Link>
      </header>

      {/* Centered Modern Auth Card */}
      <main className="container d-flex justify-content-center">
        <div className="auth-modern-card">
          {/* Left Column: Exciting Hero Showcase */}
          <div className="auth-modern-hero">
            <img
              src="/images/resources/login-hero-excited.jpg"
              alt="Socimo Community"
              className="auth-modern-hero-img"
            />
            <div className="auth-modern-hero-overlay" />

            <div className="auth-modern-hero-top">
              <div className="auth-hero-badge">
                <span className="auth-hero-badge-pulse" />
                <span>Live Community Hub</span>
              </div>
            </div>

            <div className="auth-modern-hero-content">
              <h2 className="auth-modern-hero-title">
                {isSignupMode
                  ? "Join 25,000+ creators & researchers worldwide."
                  : "Welcome back to your creative community."}
              </h2>
              <p className="auth-modern-hero-desc">
                Connect with passionate peers, publish groundbreaking ideas, exchange insights, and
                accelerate your work together.
              </p>

              <div className="auth-hero-social-proof">
                <div className="auth-hero-avatars">
                  <img src="/images/resources/user-pic1.jpg" alt="Member" />
                  <img src="/images/resources/user-pic2.jpg" alt="Member" />
                  <img src="/images/resources/user-pic3.jpg" alt="Member" />
                  <img src="/images/resources/user-pic4.jpg" alt="Member" />
                </div>
                <span className="auth-hero-stat">⚡ 4.2k active online now</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Polished Form */}
          <div className="auth-modern-form-col">
            {/* Segmented Mode Selector */}
            <div className="auth-tabs-pill">
              <button
                type="button"
                className={`auth-tab-btn ${!isSignupMode ? "active" : ""}`}
                onClick={() => switchMode(false)}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${isSignupMode ? "active" : ""}`}
                onClick={() => switchMode(true)}
              >
                Create Account
              </button>
            </div>

            {/* Form Header */}
            <div className="auth-form-header">
              <h1 className="auth-form-title">
                {isSignupMode ? "Create your account" : "Sign in to Socimo"}
              </h1>
              <p className="auth-form-subtitle">
                {isSignupMode
                  ? "Start sharing your knowledge and connect with peers."
                  : "Enter your credentials to access your personal dashboard."}
              </p>
            </div>

            {!isSignupMode ? (
              /* ================= LOGIN FORM ================= */
              <form onSubmit={handleLoginSubmit} noValidate>
                {/* Quick Demo Helper */}
                <div className="auth-demo-badge">
                  <span>💡 Testing? Auto-fill demo credentials:</span>
                  <button
                    type="button"
                    className="auth-demo-btn"
                    onClick={handleQuickDemoFill}
                  >
                    Use Demo Account
                  </button>
                </div>

                {/* Email / User Input */}
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="login-user">
                    Email or Username
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      id="login-user"
                      type="text"
                      name="user"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. admin@admin.com"
                      className="auth-input-field"
                      required
                    />
                    <span className="auth-input-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="18"
                        height="18"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Password Input */}
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="login-password">
                    Password
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      name="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="auth-input-field"
                      required
                    />
                    <span className="auth-input-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="18"
                        height="18"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <button
                      type="button"
                      className="auth-toggle-pwd"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      title={showLoginPassword ? "Hide password" : "Show password"}
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Helper Row: Remember Me & Forgot Password */}
                <div className="auth-helper-row">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <Link href="/login" className="auth-forgot-link">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Alert feedback */}
                {loginStatus.text && (
                  <div
                    className={`auth-alert-box ${
                      loginStatus.error ? "auth-alert-error" : "auth-alert-success"
                    }`}
                  >
                    {loginStatus.error ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    )}
                    <span>{loginStatus.text}</span>
                  </div>
                )}

                {/* Switch link */}
                <p className="auth-switch-prompt">
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    className="auth-inline-link"
                    onClick={() => switchMode(true)}
                  >
                    Create one now
                  </button>
                </p>
              </form>
            ) : (
              /* ================= SIGNUP FORM ================= */
              <form onSubmit={handleSignupSubmit} noValidate>
                {/* Username / First Name */}
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="new-user">
                    Full Name / Username
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      id="new-user"
                      type="text"
                      name="user"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="auth-input-field"
                      required
                    />
                    <span className="auth-input-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="18"
                        height="18"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="new-email">
                    Email Address
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      id="new-email"
                      type="email"
                      name="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. alex@example.com"
                      className="auth-input-field"
                      required
                    />
                    <span className="auth-input-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="18"
                        height="18"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Password Input */}
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="new-password">
                    Password (min. 6 characters)
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      id="new-password"
                      type={showSignupPassword ? "text" : "password"}
                      name="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="auth-input-field"
                      required
                      minLength={6}
                    />
                    <span className="auth-input-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="18"
                        height="18"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <button
                      type="button"
                      className="auth-toggle-pwd"
                      onClick={() => setShowSignupPassword((prev) => !prev)}
                      title={showSignupPassword ? "Hide password" : "Show password"}
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      id="confirm-password"
                      type={showSignupConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="auth-input-field"
                      required
                      minLength={6}
                    />
                    <span className="auth-input-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="18"
                        height="18"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </span>
                    <button
                      type="button"
                      className="auth-toggle-pwd"
                      onClick={() => setShowSignupConfirmPassword((prev) => !prev)}
                      title={showSignupConfirmPassword ? "Hide password" : "Show password"}
                      aria-label={showSignupConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showSignupConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="auth-terms-row">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <label htmlFor="termsAccepted">
                    I agree to the{" "}
                    <Link href="/" className="auth-inline-link" target="_blank">
                      Terms of Service
                    </Link>{" "}
                    and Privacy Policy.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Alert feedback */}
                {signupStatus.text && (
                  <div
                    className={`auth-alert-box ${
                      signupStatus.error ? "auth-alert-error" : "auth-alert-success"
                    }`}
                  >
                    {signupStatus.error ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    )}
                    <span>{signupStatus.text}</span>
                  </div>
                )}

                {/* Switch link */}
                <p className="auth-switch-prompt">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="auth-inline-link"
                    onClick={() => switchMode(false)}
                  >
                    Sign in here
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Decorative footer elements */}
      <figure className="bottom-mockup" style={{ marginTop: "auto" }}>
        <img alt="" src="/images/footer.png" />
      </figure>
      <div className="bottombar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span>&copy; Copyright All rights reserved by Socimo {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
