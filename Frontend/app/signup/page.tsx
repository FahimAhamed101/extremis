import type { Metadata } from "next";
import AuthBox from "@/components/auth/AuthBox";

export const metadata: Metadata = {
  title: "Updates | Signup",
  description: "Create an account on Updates research and social network.",
};

export default function SignupPage() {
  return <AuthBox initialMode="signup" />;
}
