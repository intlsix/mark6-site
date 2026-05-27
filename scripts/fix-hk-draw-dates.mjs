import fs from "fs";
import path from "path";

const file = path.join(process.cwd(), "src/data/hongkong/draws.json");
const draws = JSON.parse(fs.readFileSync(file, "utf8"));

function isDrawDayUtc(y, m, d) {
  const w = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return w === 2 || w === 4 || w === 6;
}

function prevDrawUtc(y, m, d) {
  let dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  while (![2, 4, 6].includes(dt.getUTCDay())) dt.setUTCDate(dt.getUTCDate() - 1);
  return [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()];
}

function fmt(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const sorted = [...draws].sort((a, b) => {
  const na = parseInt(a.id.split("-")[1], 10);
  const nb = parseInt(b.id.split("-")[1], 10);
  return na - nb;
});

let y = 2026;
let m = 5;
let day = 26;
if (!isDrawDayUtc(y, m, day)) throw new Error("Anchor date must be Tue/Thu/Sat");

for (let i = sorted.length - 1; i >= 0; i--) {
  sorted[i].drawAt = fmt(y, m, day);
  [y, m, day] = prevDrawUtc(y, m, day);
}

fs.writeFileSync(file, JSON.stringify(sorted.reverse(), null, 2) + "\n", "utf8");
console.log("Fixed", sorted.length, "periods. 056=", sorted.find((x) => x.id === "2026-056")?.drawAt, "055=", sorted.find((x) => x.id === "2026-055")?.drawAt);
