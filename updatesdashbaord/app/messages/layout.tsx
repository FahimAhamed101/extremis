import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description: "Read and reply to member conversations and support requests.",
};

export default function MessagesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
