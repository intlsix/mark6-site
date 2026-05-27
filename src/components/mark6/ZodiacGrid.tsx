import NumberBall from "./NumberBall";
import AnimalSvg from "./AnimalSvg";
import AnimalLabel from "./AnimalLabel";
import { ANIMAL_TO_NUMS } from "@/lib/mark6/constants";
import { ALL_ANIMALS } from "@/lib/mark6/types";

export default function ZodiacGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {ALL_ANIMALS.map((animal) => (
        <div key={animal} className="rounded-lg border border-surface-border bg-surface-card p-4 text-center">
          <AnimalSvg animal={animal} size={64} className="mx-auto mb-2" />
          <div className="font-medium text-gold mb-2"><AnimalLabel animal={animal} /></div>
          <div className="flex flex-wrap justify-center gap-1">
            {ANIMAL_TO_NUMS[animal].map((n) => (
              <NumberBall key={n} n={n} size="sm" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
