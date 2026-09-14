"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirmPass, setRegConfirmPass] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("Signing in...");
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPass !== regConfirmPass) {
      setStatusMessage("Passwords do not match!");
      return;
    }
    setStatusMessage("Account created successfully! Redirecting...");
    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  return (
    <div className="theme-layout gray-bg vh-100" style={{ minHeight: "100vh", position: "relative" }}>
      {/* Return to Dashboard Float Button */}
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 100 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#fff",
            color: "#088dcd",
            padding: "8px 16px",
            borderRadius: "30px",
            fontWeight: 600,
            fontSize: "13px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            textDecoration: "none",
          }}
        >
          <i className="icofont-arrow-left"></i> Return to Dashboard
        </Link>
      </div>

      <div className="container" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
        <div className="row justify-content-md-center">
          <div className="col-lg-8">
            <div className="logo-up">
              <figure className="logo">
                <img alt="" src="/images/logo.png" />
                <span>Socimo</span>
              </figure>
            </div>

            {statusMessage && (
              <div
                style={{
                  background: "#088dcd",
                  color: "#fff",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "15px",
                  boxShadow: "0 4px 12px rgba(8, 141, 205, 0.3)",
                }}
              >
                {statusMessage}
              </div>
            )}

            <div className="box">
              <input
                type="checkbox"
                id="toggle"
                className="box__toggle"
                checked={isRegister}
                onChange={(e) => setIsRegister(e.target.checked)}
                hidden
              />
              <img src="/images/resources/login-top.jpg" alt="Socimo Auth" className="box__image" />

              {/* Register Form */}
              <form className="form form--register" onSubmit={handleRegister}>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-key"
                  >
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </span>
                <h1 className="form__title">Sign up</h1>
                <div className="form__helper">
                  <input
                    type="text"
                    name="user"
                    id="new-user"
                    placeholder="User"
                    className="form__input"
                    value={regUser}
                    onChange={(e) => setRegUser(e.target.value)}
                    required
                  />
                  <label className="form__label" htmlFor="new-user">
                    User
                  </label>
                </div>
                <div className="form__helper">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="form__input"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  <label className="form__label" htmlFor="email">
                    Email
                  </label>
                </div>
                <div className="form__helper">
                  <input
                    type="password"
                    name="password"
                    id="new-user-password"
                    placeholder="Password"
                    className="form__input"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    required
                  />
                  <label className="form__label" htmlFor="new-user-password">
                    Password
                  </label>
                </div>
                <div className="form__helper">
                  <input
                    type="password"
                    name="password"
                    id="confirm-password"
                    placeholder="Confirm password"
                    className="form__input"
                    value={regConfirmPass}
                    onChange={(e) => setRegConfirmPass(e.target.value)}
                    required
                  />
                  <label className="form__label" htmlFor="confirm-password">
                    Confirm password
                  </label>
                </div>
                <button type="submit" className="form__button">
                  Register
                </button>
                <p className="form__text">
                  Already have an account?{" "}
                  <label
                    htmlFor="toggle"
                    className="form__link"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsRegister(false)}
                  >
                    Sign in!
                  </label>
                </p>
              </form>

              {/* Login Form */}
              <form className="form form--login" onSubmit={handleLogin}>
                <span>
                  <svg
                    id="login"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-users"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <h1 className="form__title">Sign in</h1>
                <div className="form__helper">
                  <input
                    type="text"
                    name="user"
                    id="user"
                    placeholder="User"
                    className="form__input"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    required
                  />
                  <label className="form__label" htmlFor="user">
                    User
                  </label>
                </div>
                <div className="form__helper">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="form__input"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                  />
                  <label className="form__label" htmlFor="password">
                    Password
                  </label>
                </div>
                <button type="submit" className="form__button">
                  Login
                </button>
                <p className="form__text">
                  Don't have an account?{" "}
                  <label
                    htmlFor="toggle"
                    className="form__link"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsRegister(true)}
                  >
                    Sign up!
                  </label>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <figure className="bottom-mockup">
        <img alt="" src="/images/footer.png" />
      </figure>
      <div className="bottombar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span className="">&copy; Copyright All rights reserved by socimo 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
