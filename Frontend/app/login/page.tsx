import type { Metadata } from "next";
import AuthBox from "@/components/auth/AuthBox";

export const metadata: Metadata = {
  title: "Updates | Login",
  description: "Sign in to Updates research and social network.",
};

export default function LoginPage() {
  return <AuthBox initialMode="login" />;
}
