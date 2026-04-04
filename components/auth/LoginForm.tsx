"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/services/authApi";
import { setAuthSession } from "@/lib/auth/client";
import { extractApiErrorMessage } from "@/lib/utils/extractApiErrorMessage";

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
      setStatus({ text: extractApiErrorMessage(error, "Login failed."), error: true });
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
