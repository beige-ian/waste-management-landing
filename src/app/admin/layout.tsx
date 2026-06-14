import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "대형폐기물 어드민",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
