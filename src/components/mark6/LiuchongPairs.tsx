import { LIUCHONG_PAIRS } from "@/lib/mark6/constants";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "./AnimalLabel";

export default function LiuchongPairs() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {LIUCHONG_PAIRS.map(([a, b]) => (
        <div key={`${a}-${b}`} className="flex items-center justify-center gap-3 rounded-lg border border-red-900/40 bg-surface-card p-3">
          <div className="flex flex-col items-center">
            <AnimalSvg animal={a} size={40} />
            <AnimalLabel animal={a} />
          </div>
          <span className="text-red-400">←→</span>
          <div className="flex flex-col items-center">
            <AnimalSvg animal={b} size={40} />
            <AnimalLabel animal={b} />
          </div>
        </div>
      ))}
    </div>
  );
}
