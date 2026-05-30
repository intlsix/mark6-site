"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminFetch } from "@/lib/admin/admin-fetch";

interface AnalyticsSummary {
  totalViews: number;
  dailyViews: { date: string; count: number }[];
  monthlyViews: { month: string; count: number }[];
  yearlyViews: { year: string; count: number }[];
  topCountries: { country: string; count: number; percentage: number }[];
  topPages: { path: string; count: number; percentage: number }[];
  topSources: { source: string; count: number; percentage: number }[];
  recentViews: { path: string; country: string; referrer: string; timestamp: string }[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/analytics/track")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      {loading ? (
        <div className="text-text-muted p-8">加载中...</div>
      ) : !data ? (
        <div className="text-text-muted p-8">暂无统计数据</div>
      ) : (
        <div className="space-y-6">
          {/* Header stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="总浏览量" value={data.totalViews.toLocaleString()} color="gold" />
            <StatCard label="今日" value={data.dailyViews[data.dailyViews.length - 1]?.count.toString() || "0"} color="green" />
            <StatCard label="本月" value={data.monthlyViews[data.monthlyViews.length - 1]?.count.toString() || "0"} color="blue" />
            <StatCard label="覆盖国家" value={data.topCountries.length.toString()} color="purple" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Daily chart */}
            <Panel title="日浏览量（近30天）">
              {data.dailyViews.length === 0 ? (
                <p className="text-text-muted/50 text-sm py-8 text-center">上线后显示每日趋势</p>
              ) : (
                <div className="flex items-end gap-0.5 h-32">
                  {data.dailyViews.slice(-30).map((d) => {
                    const maxDaily = Math.max(...data.dailyViews.map((x) => x.count), 1);
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center justify-end group relative" style={{ height: "100%" }}>
                        <div
                          className="w-full bg-gold/60 hover:bg-gold rounded-t-sm transition min-h-[2px]"
                          style={{ height: `${Math.max((d.count / maxDaily) * 100, 1)}%` }}
                          title={`${d.date}: ${d.count}`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>

            {/* Countries */}
            <Panel title="国家/地区分布">
              {data.topCountries.length === 0 ? (
                <p className="text-text-muted/50 text-sm py-8 text-center">部署后自动识别访客国家</p>
              ) : (
                <div className="space-y-2">
                  {data.topCountries.slice(0, 10).map((c) => (
                    <div key={c.country} className="flex items-center gap-2 text-sm">
                      <span className="w-20 text-text-muted truncate">{c.country}</span>
                      <div className="flex-1 bg-surface-border rounded-full h-3 overflow-hidden">
                        <div className="bg-gold h-full rounded-full" style={{ width: `${c.percentage}%` }} />
                      </div>
                      <span className="w-12 text-right text-text-muted text-xs">{c.count}</span>
                      <span className="w-12 text-right text-text-muted/50 text-xs">{c.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Monthly */}
            <Panel title="月浏览量">
              {data.monthlyViews.length === 0 ? (
                <p className="text-text-muted/50 text-sm py-8 text-center">暂无月数据</p>
              ) : (
                <div className="space-y-2">
                  {data.monthlyViews.map((m) => {
                    const maxM = Math.max(...data.monthlyViews.map((x) => x.count), 1);
                    return (
                      <div key={m.month} className="flex items-center gap-3 text-sm">
                        <span className="w-24 text-text-muted">{m.month}</span>
                        <div className="flex-1 bg-surface-border rounded-full h-2.5 overflow-hidden">
                          <div className="bg-gold h-full rounded-full" style={{ width: `${Math.max((m.count / maxM) * 100, 2)}%` }} />
                        </div>
                        <span className="w-16 text-right text-text-muted">{m.count.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>

            {/* Top pages */}
            <Panel title="热门页面 TOP 10">
              {data.topPages.length === 0 ? (
                <p className="text-text-muted/50 text-sm py-8 text-center">暂无页面数据</p>
              ) : (
                <div className="space-y-2">
                  {data.topPages.slice(0, 10).map((p) => {
                    const maxP = Math.max(...data.topPages.map((x) => x.count), 1);
                    return (
                      <div key={p.path} className="flex items-center gap-2 text-sm">
                        <span className="w-32 text-text-muted truncate" title={p.path}>{p.path || "/"}</span>
                        <div className="flex-1 bg-surface-border rounded-full h-3 overflow-hidden">
                          <div className="bg-gold h-full rounded-full" style={{ width: `${(p.count / maxP) * 100}%` }} />
                        </div>
                        <span className="w-12 text-right text-text-muted text-xs">{p.count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>

            {/* Traffic sources */}
            <Panel title="流量来源">
              {!data.topSources || data.topSources.length === 0 ? (
                <p className="text-text-muted/50 text-sm py-8 text-center">上线后自动统计来源</p>
              ) : (
                <div className="space-y-2">
                  {data.topSources.slice(0, 10).map((s) => {
                    const maxS = Math.max(...data.topSources.map((x) => x.count), 1);
                    return (
                      <div key={s.source} className="flex items-center gap-2 text-sm">
                        <span className="w-28 text-text-muted truncate">{s.source}</span>
                        <div className="flex-1 bg-surface-border rounded-full h-3 overflow-hidden">
                          <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(s.count / maxS) * 100}%` }} />
                        </div>
                        <span className="w-12 text-right text-text-muted text-xs">{s.count}</span>
                        <span className="w-12 text-right text-text-muted/50 text-xs">{s.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>

            {/* Yearly */}
            <Panel title="年度总览">
              {data.yearlyViews.length === 0 ? (
                <p className="text-text-muted/50 text-sm py-8 text-center">暂无年数据</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {data.yearlyViews.map((y) => (
                    <div key={y.year} className="text-center p-3 rounded border border-surface-border bg-surface/50">
                      <div className="text-2xl font-bold text-gold">{y.count.toLocaleString()}</div>
                      <div className="text-xs text-text-muted mt-1">{y.year}年</div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Recent */}
            <Panel title="最近访问记录">
              {data.recentViews.length === 0 ? (
                <p className="text-text-muted/50 text-sm py-8 text-center">暂无访问记录</p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {data.recentViews.map((v, i) => {
                    const src = v.referrer
                      ? (() => {
                          const u = (v.referrer || "").toLowerCase();
                          if (!u || u === "direct") return "直接";
                          if (u.includes("google.")) return "Google";
                          if (u.includes("bing.")) return "Bing";
                          if (u.includes("baidu.")) return "百度";
                          try { return new URL(v.referrer).hostname.replace("www.","").slice(0,18); } catch { return "外链"; }
                        })()
                      : "直接";
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs text-text-muted py-0.5 border-b border-surface-border/30">
                        <span className="text-text-muted/40 w-16">{v.timestamp.slice(11, 19)}</span>
                        <span className="flex-1 truncate">{v.path}</span>
                        <span className="w-14 text-right text-text-muted/40 truncate" title={src}>{src}</span>
                        <span className="w-12 text-right text-text-muted/50">{v.country}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    gold: "text-gold",
    green: "text-green-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
  };
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-4 text-center">
      <div className={`text-2xl font-bold ${colorMap[color] || "text-gold"}`}>{value}</div>
      <div className="text-xs text-text-muted mt-1">{label}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-4">
      <h3 className="text-sm font-semibold text-gold mb-3">{title}</h3>
      {children}
    </div>
  );
}
