import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Extremis | Signup",
  description: "Extremis signup page",
};

export default function SignupPage() {
  return (
    <>
      <div className="theme-layout signup-theme-layout">
        <div className="authtication bluesh high-opacity">
          <div className="verticle-center">
            <div className="welcome-note">
              <div className="logo">
                <img src="/images/logo.png" alt="" />
                <span>Extremis</span>
              </div>
              <h1>Welcome to Extremis</h1>
              <p>
                Extremis is a one and only plateform for the researcheres, students, and Acdamic
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
    </>
  );
}
