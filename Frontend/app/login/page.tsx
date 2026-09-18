import type { Metadata } from "next";
import AuthBox from "@/components/auth/AuthBox";

export const metadata: Metadata = {
  title: "Log In to Updates – Connect with Friends, Family & Communities",
  description:
    "Log in to your Updates account to see the latest updates from friends and family, browse community groups, and join conversations.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return <AuthBox initialMode="login" />;
}
