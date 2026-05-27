export type Animal =
  | "鼠" | "牛" | "虎" | "兔" | "龙" | "蛇"
  | "马" | "羊" | "猴" | "鸡" | "狗" | "猪";

export type Wave = "红波" | "蓝波" | "绿波";

export const ALL_ANIMALS: Animal[] = [
  "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪",
];

export interface DrawRecord {
  id: string;
  drawAt: string;
  numbers: number[];
  special: number;
  seedHash?: string;
  seed?: string;
  source?: "auto" | "manual";
}

export interface KnowledgeArticle {
  id: string;
  category: string;
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
  contentZh: string;
  contentEn: string;
  published: boolean;
  updatedAt: string;
}

export interface AdminLogEntry {
  id: string;
  at: string;
  action: string;
  detail: string;
  ip?: string;
}
