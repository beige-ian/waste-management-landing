import type { Metadata } from "next";
import { InviteBridge } from "@/components/bridge/InviteBridge";

interface Props {
  searchParams: Promise<{ code?: string; name?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { name } = await searchParams;
  const displayName = name || "친구";
  const title = `${displayName}님이 집정리 3만원 지원금을 보냈습니다`;
  const description =
    "커버링 앱에서 대형폐기물 수거 3만원 할인 지원금을 받으세요.";

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default function InvitePage() {
  return <InviteBridge />;
}
