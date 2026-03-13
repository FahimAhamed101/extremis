"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/services/authApi";
import { setAuthSession } from "@/lib/auth/client";

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: unknown }).data === "object" &&
    (error as { data?: { message?: unknown } }).data?.message &&
    typeof (error as { data?: { message?: unknown } }).data?.message === "string"
  ) {
    return (error as { data: { message: string } }).data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Login failed.";
}

export default function LoginForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [status, setStatus] = useState<{ text: string; error: boolean }>({
    text: "",
    error: false,
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    try {
      const response = await login(payload).unwrap();
      setAuthSession(response.token, response.user);
      setStatus({ text: "Login successful. Redirecting...", error: false });
      setTimeout(() => {
        router.replace("/");
      }, 900);
    } catch (error) {
      setStatus({ text: getErrorMessage(error), error: true });
    }
  };

  return (
    <form method="post" className="c-form" onSubmit={onSubmit}>
      <input type="email" name="email" placeholder="Email@" required />
      <input type="password" name="password" placeholder="xxxxxxxxxx" required />
      <div className="checkbox">
        <input type="checkbox" id="remember-me" defaultChecked />
        <label htmlFor="remember-me">
          <span>Remember Me</span>
        </label>
      </div>
      <button className="main-btn" type="submit" disabled={isLoading}>
        <i className="icofont-key"></i> {isLoading ? "Logging in..." : "Login"}
      </button>
      <p
        style={{
          marginTop: "10px",
          marginBottom: 0,
          color: status.error ? "#d42626" : "#1a8f4d",
        }}
      >
        {status.text}
      </p>
    </form>
  );
}
