import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

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
              <form method="post" className="c-form">
                <div className="row merged-10">
                  <div className="col-lg-12">
                    <h4>What type of researcher are you?</h4>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="text" placeholder="First Name" />
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="text" placeholder="Last Name" />
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="text" placeholder="Email@" />
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="password" placeholder="Password" />
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="radio" id="student" name="acdamic" value="student" />
                    <label htmlFor="student">Academic Or Student</label>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="radio" id="ngo" name="acdamic" value="ngo" />
                    <label htmlFor="ngo">Corporate, Govt, Or NGO Person</label>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="radio" id="medical" name="acdamic" value="medical" />
                    <label htmlFor="medical">Medical</label>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="radio" id="other" name="acdamic" value="other" />
                    <label htmlFor="other">Not a Rsearcher</label>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="text" placeholder="Institute, Company" />
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <input type="text" placeholder="Department" />
                  </div>
                  <div className="col-lg-12">
                    <input type="text" placeholder="Your Position" />
                  </div>
                  <div className="col-lg-12">
                    <div className="gender">
                      <input type="radio" id="male" name="gender" value="male" />
                      <label htmlFor="male">Male</label>
                      <input type="radio" id="female" name="gender" value="female" />
                      <label htmlFor="female">Female</label>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="checkbox">
                      <input type="checkbox" id="terms" defaultChecked />
                      <label htmlFor="terms">
                        <span>
                          I agree the terms of Services and acknowledge the privacy policy
                        </span>
                      </label>
                    </div>
                    <button className="main-btn" type="submit">
                      <i className="icofont-key"></i> Signup
                    </button>
                  </div>
                </div>
              </form>
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
