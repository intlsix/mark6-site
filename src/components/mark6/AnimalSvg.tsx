import Image from "next/image";
import { animalImagePath } from "@/lib/mark6/animal-assets";
import type { Animal } from "@/lib/mark6/types";

interface Props {
  animal: Animal;
  size?: number;
  className?: string;
}

export default function AnimalSvg({ animal, size = 48, className = "" }: Props) {
  return (
    <Image
      src={animalImagePath(animal)}
      alt={animal}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
