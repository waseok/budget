export type BudgetCategorySummary = {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
};

export type ExpenseItem = {
  id: string;
  title: string;
  category: string;
  amount: number;
  spentOn: string;
};

export type WishlistItem = {
  id: string;
  title: string;
  note: string;
  expectedPrice: number;
  priority: "low" | "medium" | "high";
  imageUrl: string;
  productUrl: string;
};

export const budgetCategories: BudgetCategorySummary[] = [
  { id: "1", name: "교재·학습자료", allocated: 800000, spent: 462000, color: "#1d4ed8" },
  { id: "2", name: "교실 소모품", allocated: 500000, spent: 317500, color: "#0891b2" },
  { id: "3", name: "행사 준비", allocated: 350000, spent: 124000, color: "#f97316" },
  { id: "4", name: "학생 보상", allocated: 200000, spent: 186000, color: "#dc2626" },
];

export const recentExpenses: ExpenseItem[] = [
  { id: "1", title: "색지 및 코팅지", category: "교실 소모품", amount: 48000, spentOn: "2026-03-14" },
  { id: "2", title: "사회 활동지 인쇄", category: "교재·학습자료", amount: 27000, spentOn: "2026-03-13" },
  { id: "3", title: "학급 행사 간식", category: "행사 준비", amount: 62000, spentOn: "2026-03-12" },
  { id: "4", title: "칭찬 스티커 세트", category: "학생 보상", amount: 18000, spentOn: "2026-03-11" },
];

export const wishlistItems: WishlistItem[] = [
  {
    id: "1",
    title: "무선 라벨 프린터",
    note: "교실 물품 정리에 쓰기 좋음",
    expectedPrice: 89000,
    priority: "high",
    imageUrl:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=900&q=80",
    productUrl: "https://example.com/label-printer",
  },
  {
    id: "2",
    title: "A4 문서 트레이 세트",
    note: "과제 분류용 3단 트레이",
    expectedPrice: 32000,
    priority: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
    productUrl: "https://example.com/document-tray",
  },
  {
    id: "3",
    title: "휴대용 미니 빔프로젝터",
    note: "학급 발표 시간용으로 검토 중",
    expectedPrice: 169000,
    priority: "low",
    imageUrl:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80",
    productUrl: "https://example.com/projector",
  },
];
