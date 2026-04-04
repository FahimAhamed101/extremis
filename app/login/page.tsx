import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Extremis | Login",
  description: "Extremis login page",
};

export default function LoginPage() {
  return (
    <>
      <div className="theme-layout login-theme-layout">
        <div className="authtication bluesh high-opacity">
          <div
            className="bg-image"
            style={{ backgroundImage: "url(/images/resources/login-bg3.jpg)" }}
          ></div>
          <ul className="welcome-caro">
            <li className="welcome-box">
              <figure>
                <img src="/images/resources/login-1.png" alt="" />
              </figure>
              <h4>Ask questions with seniors Researchers</h4>
              <p>
                Ask questions and get the experienced answer by researchers and others fellows.
              </p>
            </li>
            <li className="welcome-box">
              <figure>
                <img src="/images/resources/login-2.png" alt="" />
              </figure>
              <h4>Find New Researchers or Friends</h4>
              <p>Join Extremis and make your network of university or college fellows.</p>
            </li>
            <li className="welcome-box">
              <figure>
                <img src="/images/resources/login-3.png" alt="" />
              </figure>
              <h4>Sell Your Online paid Content</h4>
              <p>Sell your online lectures, videos, books and many more with Extremis.</p>
            </li>
          </ul>
        </div>

        <div className="auth-login">
          <div className="logo">
            <img src="/images/logo.png" alt="" />
            <span>Extremis</span>
          </div>
          <div className="mockup left-bottom">
            <img src="/images/mockup.png" alt="" />
          </div>
          <div className="verticle-center">
            <div className="login-form">
              <h4>
                <i className="icofont-key-hole"></i> Login
              </h4>
              <LoginForm />
              <p style={{ marginTop: "12px" }}>
                No account? <Link href="/signup">Signup</Link>
              </p>
            </div>
          </div>
          <div className="mockup right">
            <img src="/images/star-shape.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
