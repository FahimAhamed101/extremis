import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Extremis | Signup",
  description: "Socimo style signup page",
};

export default function SignupPage() {
  return (
    <>
      <div className="page-loader" id="page-loader">
        <div className="loader">
          <span className="loader-item"></span>
          <span className="loader-item"></span>
          <span className="loader-item"></span>
          <span className="loader-item"></span>
          <span className="loader-item"></span>
          <span className="loader-item"></span>
          <span className="loader-item"></span>
          <span className="loader-item"></span>
          <span className="loader-item"></span>
          <span className="loader-item"></span>
        </div>
      </div>

      <div className="theme-layout">
        <div className="authtication bluesh high-opacity">
          <div className="verticle-center">
            <div className="welcome-note">
              <div className="logo">
                <img src="/images/logo.png" alt="" />
                <span>Socimo</span>
              </div>
              <h1>Welcome to Socimo</h1>
              <p>
                Socimo is a one and only plateform for the researcheres, students, and Acdamic
                people. Every one can join this plateform free and share his ideas and research
                with seniors and juniours comments and openions.
              </p>
            </div>
            <div
              className="bg-image"
              style={{ backgroundImage: "url(/images/resources/login-bg.png)" }}
            ></div>
          </div>
        </div>

        <div className="auth-login">
          <div className="verticle-center">
            <div className="signup-form">
              <h4>
                <i className="icofont-lock"></i> Singup
              </h4>
              <p style={{ marginBottom: "10px" }}>
                Already have an account? <Link href="/login">Login</Link>
              </p>
              <SignupForm />
            </div>
          </div>
        </div>
      </div>

      <Script id="loader-fallback-signup" strategy="afterInteractive">
        {`
          (function () {
            var hideLoader = function () {
              var loader = document.getElementById("page-loader");
              if (!loader) return;
              loader.classList.add("hidden");
              loader.style.display = "none";
            };

            if (document.readyState === "complete" || document.readyState === "interactive") {
              hideLoader();
            } else {
              document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
            }

            window.addEventListener("load", hideLoader, { once: true });
            setTimeout(hideLoader, 1500);
          })();
        `}
      </Script>
      <Script src="/js/main.min.js" strategy="afterInteractive" />
      <Script src="/js/script.js" strategy="afterInteractive" />
    </>
  );
}
