import fs from "fs";
import path from "path";
import type { KnowledgeArticle } from "@/lib/mark6/types";

const DATA_PATH = path.join(process.cwd(), "src/data/knowledge-base.json");

export function getArticles(): KnowledgeArticle[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as KnowledgeArticle[];
  } catch {
    return [];
  }
}

export function getPublishedArticles(): KnowledgeArticle[] {
  return getArticles().filter((a) => a.published);
}

export function saveArticles(articles: KnowledgeArticle[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2) + "\n", "utf8");
}

export function upsertArticle(article: KnowledgeArticle): void {
  const all = getArticles();
  const idx = all.findIndex((a) => a.id === article.id);
  if (idx >= 0) all[idx] = article;
  else all.push(article);
  saveArticles(all);
}

export function deleteArticle(id: string): boolean {
  const all = getArticles();
  const next = all.filter((a) => a.id !== id);
  if (next.length === all.length) return false;
  saveArticles(next);
  return true;
}
