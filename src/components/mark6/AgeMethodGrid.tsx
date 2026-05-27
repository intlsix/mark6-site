import { buildYearMap } from "@/lib/mark6/suishufa";
import NumberBall from "./NumberBall";
import AnimalLabel from "./AnimalLabel";
import { getSuiShuFaNumbers } from "@/lib/mark6/suishufa";

export default function AgeMethodGrid({ year }: { year: number }) {
  const map = buildYearMap(year);
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Object.entries(map).map(([rem, animal]) => (
        <div key={rem} className="rounded-lg border border-surface-border bg-surface-card p-3 flex items-center gap-2">
          <div className="text-sm text-gold shrink-0"><AnimalLabel animal={animal} /></div>
          <div className="flex flex-wrap gap-1">
            {getSuiShuFaNumbers(animal, year).slice(0, 5).map((n) => (
              <NumberBall key={n} n={n} size="sm" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
