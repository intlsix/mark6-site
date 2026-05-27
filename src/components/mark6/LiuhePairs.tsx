import { LIUHE_PAIRS } from "@/lib/mark6/constants";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "./AnimalLabel";

export default function LiuhePairs() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {LIUHE_PAIRS.map(([a, b]) => (
        <div key={`${a}-${b}`} className="flex items-center justify-center gap-3 rounded-lg border border-surface-border bg-surface-card p-3">
          <div className="flex flex-col items-center">
            <AnimalSvg animal={a} size={40} />
            <AnimalLabel animal={a} />
          </div>
          <span className="text-gold">↔</span>
          <div className="flex flex-col items-center">
            <AnimalSvg animal={b} size={40} />
            <AnimalLabel animal={b} />
          </div>
        </div>
      ))}
    </div>
  );
}
