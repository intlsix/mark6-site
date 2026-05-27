import type { KnowledgeArticle } from "@/lib/mark6/types";
import { readJson, writeJson } from "@/lib/storage/json-store";

const KEY = "knowledge-base.json";

export async function getArticles(): Promise<KnowledgeArticle[]> {
  return readJson<KnowledgeArticle[]>(KEY, []);
}

export async function getPublishedArticles(): Promise<KnowledgeArticle[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.published);
}

export async function saveArticles(articles: KnowledgeArticle[]): Promise<boolean> {
  return writeJson(KEY, articles);
}

export async function upsertArticle(article: KnowledgeArticle): Promise<boolean> {
  const all = await getArticles();
  const idx = all.findIndex((a) => a.id === article.id);
  if (idx >= 0) all[idx] = article;
  else all.push(article);
  return saveArticles(all);
}

export async function deleteArticle(id: string): Promise<boolean> {
  const all = await getArticles();
  const next = all.filter((a) => a.id !== id);
  if (next.length === all.length) return false;
  return saveArticles(next);
}
