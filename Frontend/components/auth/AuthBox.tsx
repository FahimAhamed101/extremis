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
  const [signupPhone, setSignupPhone] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [signupGender, setSignupGender] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationAttempted, setLocationAttempted] = useState(false);
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  const normalizeCoordinates = (lat: number, lng: number) => {
    return {
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
    };
  };

  const fetchCoordinatesFromAddress = async (query: string) => {
    if (!query) return null;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );
      if (!response.ok) return null;
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return null;
      const lat = Number(data[0]?.lat);
      const lng = Number(data[0]?.lon ?? data[0]?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return normalizeCoordinates(lat, lng);
    } catch {
      return null;
    }
  };

  const fetchCoordinatesFromBrowser = () =>
    new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (typeof window === "undefined" || !("geolocation" in navigator)) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(normalizeCoordinates(position.coords.latitude, position.coords.longitude));
        },
        (error) => reject(error),
        { enableHighAccuracy: false, timeout: 4000, maximumAge: 60000 }
      );
    });

  const fetchAddressFromCoordinates = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (!response.ok) return null;
      const data = await response.json();
      if (!data) return null;
      const addr = data.address;
      if (addr) {
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.county || "";
        const country = addr.country || "";
        if (city && country) return `${city}, ${country}`;
        if (city) return city;
        if (country) return country;
      }
      if (data.display_name) {
        return String(data.display_name).split(",").slice(0, 2).join(",").trim();
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchCoordinatesFromIp = async (): Promise<{ coords: { lat: number; lng: number }; location: string } | null> => {
    // 1. ipwho.is (fast, reliable, CORS enabled)
    try {
      const res = await fetch("https://ipwho.is/");
      if (res.ok) {
        const data = await res.json();
        const lat = Number(data.latitude);
        const lng = Number(data.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          const loc = [data.city, data.country].filter(Boolean).join(", ");
          return { coords: normalizeCoordinates(lat, lng), location: loc };
        }
      }
    } catch {
      // ignore & try next
    }

    // 2. freeipapi
    try {
      const res = await fetch("https://freeipapi.com/api/json");
      if (res.ok) {
        const data = await res.json();
        const lat = Number(data.latitude);
        const lng = Number(data.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          const loc = [data.cityName, data.countryName].filter(Boolean).join(", ");
          return { coords: normalizeCoordinates(lat, lng), location: loc };
        }
      }
    } catch {
      // ignore & try next
    }

    // 3. ipapi.co
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (res.ok) {
        const data = await res.json();
        const lat = Number(data.latitude);
        const lng = Number(data.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          const loc = [data.city, data.country_name].filter(Boolean).join(", ");
          return { coords: normalizeCoordinates(lat, lng), location: loc };
        }
      }
    } catch {
      // ignore
    }

    return null;
  };

  const buildAddressQuery = () => {
    return locationName.trim();
  };

  const resolveCoordinates = async (force = false) => {
    if (coordinates && !force) return coordinates;
    setIsLocating(true);
    setLocationAttempted(true);

    try {
      const query = buildAddressQuery();
      if (query && force) {
        const geocoded = await fetchCoordinatesFromAddress(query);
        if (geocoded) {
          setCoordinates(geocoded);
          return geocoded;
        }
      }

      // Try browser geolocation first
      try {
        const browserCoords = await fetchCoordinatesFromBrowser();
        setCoordinates(browserCoords);
        fetchAddressFromCoordinates(browserCoords.lat, browserCoords.lng).then((loc) => {
          if (loc) setLocationName(loc);
        });
        return browserCoords;
      } catch {
        // Immediate fallback to IP geolocation
        const ipResult = await fetchCoordinatesFromIp();
        if (ipResult) {
          setCoordinates(ipResult.coords);
          if (ipResult.location) {
            setLocationName(ipResult.location);
          }
          return ipResult.coords;
        }
        return null;
      }
    } catch {
      return null;
    } finally {
      setIsLocating(false);
      setLocationAttempted(true);
    }
  };

  useEffect(() => {
    setIsSignupMode(initialMode === "signup");
  }, [initialMode]);

  useEffect(() => {
    if (isSignupMode && !coordinates) {
      resolveCoordinates();
    }
  }, [isSignupMode]);

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

    // Auto get & save location upon submit
    let resolvedCoords = coordinates;
    let resolvedLocation = locationName.trim();

    if (resolvedLocation && !resolvedCoords) {
      try {
        const geocoded = await fetchCoordinatesFromAddress(resolvedLocation);
        if (geocoded) {
          resolvedCoords = geocoded;
          setCoordinates(geocoded);
        }
      } catch {
        // ignore
      }
    }

    if (!resolvedCoords) {
      try {
        resolvedCoords = await resolveCoordinates(false);
        if (resolvedCoords && !resolvedLocation) {
          resolvedLocation = (await fetchAddressFromCoordinates(resolvedCoords.lat, resolvedCoords.lng)) || "";
          if (resolvedLocation) {
            setLocationName(resolvedLocation);
          }
        }
      } catch {
        // Proceed gracefully without blocking signup
      }
    }

    const dob = dobYear && dobMonth && dobDay ? `${dobYear}-${dobMonth}-${dobDay}` : "";

    try {
      const response = await signupMutation({
        firstName: user,
        lastName: "",
        email,
        password,
        phoneNumber: signupPhone.trim() || undefined,
        gender: signupGender || undefined,
        dateOfBirth: dob || undefined,
        location: resolvedLocation || undefined,
        coordinates: resolvedCoords || null,
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

                {/* Phone Number */}
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="new-phone">
                    Phone Number
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      id="new-phone"
                      type="tel"
                      name="phoneNumber"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="e.g. +1 555-0199"
                      className="auth-input-field"
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
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Date of birth */}
                <div className="auth-input-group">
                  <div className="auth-label-with-tip">
                    <label className="auth-input-label" htmlFor="dob-day">
                      Date of birth
                    </label>
                    <div className="auth-tooltip-trigger" tabIndex={0} aria-label="Date of birth info">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="15"
                        height="15"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span className="auth-tooltip-bubble">
                        Providing your birthday helps verify your age and personalize your community experience.
                      </span>
                    </div>
                  </div>
                  <div className="auth-dob-row">
                    <div className="auth-select-wrapper">
                      <select
                        id="dob-day"
                        value={dobDay}
                        onChange={(e) => setDobDay(e.target.value)}
                        className="auth-select-field"
                      >
                        <option value="">Day</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={String(d).padStart(2, "0")}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <span className="auth-select-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>

                    <div className="auth-select-wrapper">
                      <select
                        id="dob-month"
                        value={dobMonth}
                        onChange={(e) => setDobMonth(e.target.value)}
                        className="auth-select-field"
                      >
                        <option value="">Month</option>
                        {[
                          { val: "01", name: "Jan" },
                          { val: "02", name: "Feb" },
                          { val: "03", name: "Mar" },
                          { val: "04", name: "Apr" },
                          { val: "05", name: "May" },
                          { val: "06", name: "Jun" },
                          { val: "07", name: "Jul" },
                          { val: "08", name: "Aug" },
                          { val: "09", name: "Sep" },
                          { val: "10", name: "Oct" },
                          { val: "11", name: "Nov" },
                          { val: "12", name: "Dec" },
                        ].map((m) => (
                          <option key={m.val} value={m.val}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      <span className="auth-select-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>

                    <div className="auth-select-wrapper">
                      <select
                        id="dob-year"
                        value={dobYear}
                        onChange={(e) => setDobYear(e.target.value)}
                        className="auth-select-field"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 110 }, (_, i) => 2026 - i).map((y) => (
                          <option key={y} value={String(y)}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <span className="auth-select-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="auth-input-group">
                  <div className="auth-label-with-tip">
                    <label className="auth-input-label" htmlFor="new-gender">
                      Gender
                    </label>
                    <div className="auth-tooltip-trigger" tabIndex={0} aria-label="Gender info">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="15"
                        height="15"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span className="auth-tooltip-bubble">
                        Select your gender identity. You can customize who can see this on your profile.
                      </span>
                    </div>
                  </div>
                  <div className="auth-select-wrapper">
                    <select
                      id="new-gender"
                      value={signupGender}
                      onChange={(e) => setSignupGender(e.target.value)}
                      className="auth-select-field"
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary / Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                    <span className="auth-select-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Location Field */}
                <div className="auth-input-group">
                  <div className="auth-location-header">
                    <label className="auth-input-label" htmlFor="signup-location" style={{ marginBottom: 0 }}>
                      Location
                    </label>
                    {isLocating ? (
                      <span className="auth-location-status-badge locating">
                        <span className="auth-status-dot pulse-yellow" />
                        Detecting...
                      </span>
                    ) : locationName || coordinates ? (
                      <span className="auth-location-status-badge detected">
                        <span className="auth-status-dot dot-green" />
                        Detected
                      </span>
                    ) : (
                      <span className="auth-location-status-badge not-detected">
                        <span className="auth-status-dot dot-red" />
                        Not detected
                      </span>
                    )}
                  </div>
                  <div className="auth-input-wrapper">
                    <input
                      id="signup-location"
                      type="text"
                      name="location"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder={
                        isLocating
                          ? "Auto-detecting your location..."
                          : locationAttempted && !locationName
                          ? "Not detected — click Auto-Detect or type city"
                          : "e.g. London, United Kingdom"
                      }
                      className={`auth-input-field ${
                        !isLocating && locationAttempted && !locationName && !coordinates
                          ? "field-not-detected"
                          : ""
                      }`}
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
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <button
                      type="button"
                      className="auth-input-action-btn"
                      onClick={() => resolveCoordinates(true)}
                      disabled={isLocating}
                      title="Auto-detect current location"
                    >
                      {isLocating ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                            style={{ width: "12px", height: "12px" }}
                          />
                          <span>Detecting</span>
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="22" y1="12" x2="18" y2="12" />
                            <line x1="6" y1="12" x2="2" y2="12" />
                            <line x1="12" y1="6" x2="12" y2="2" />
                            <line x1="12" y1="22" x2="12" y2="18" />
                          </svg>
                          <span>Auto-Detect</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hint directly under location input */}
                  {locationName || coordinates ? (
                    <p className="auth-field-hint hint-success">
                      <span>✓ Detected:</span>
                      <strong>{locationName || "Current location"}</strong>
                      {coordinates && (
                        <span>({coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)})</span>
                      )}
                    </p>
                  ) : isLocating ? (
                    <p className="auth-field-hint hint-info">
                      <span>⏳ Detecting coordinates & address...</span>
                    </p>
                  ) : (
                    <p className="auth-field-hint hint-warning">
                      <span>⚠️ Not detected</span> — Click <strong>Auto-Detect</strong> or type your city/country manually.
                    </p>
                  )}
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
