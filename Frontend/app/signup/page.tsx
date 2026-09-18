import type { Metadata } from "next";
import AuthBox from "@/components/auth/AuthBox";

export const metadata: Metadata = {
  title: "Join Updates – Connect with Friends & Family | Create Free Account",
  description:
    "Sign up for Updates, the modern social platform to meet friends and family, share updates and photos, join community groups, and chat in real-time.",
  alternates: {
    canonical: "/signup",
  },
};

export default function SignupPage() {
  return <AuthBox initialMode="signup" />;
}
