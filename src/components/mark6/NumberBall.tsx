import { numToWave, waveColorClass } from "@/lib/mark6/waves";

interface Props {
  n: number;
  size?: "sm" | "md" | "lg" | "xl";
  showNum?: boolean;
}

const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base", xl: "h-16 w-16 text-xl" };

export default function NumberBall({ n, size = "md", showNum = true }: Props) {
  const wave = numToWave(n);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold text-white shadow-md ${waveColorClass(wave)} ${sizes[size]}`}
      title={wave}
    >
      {showNum ? String(n).padStart(2, "0") : null}
    </span>
  );
}
