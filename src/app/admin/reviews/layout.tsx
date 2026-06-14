import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "대형폐기물 제출 후기 어드민",
  },
};

export default function AdminReviewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
