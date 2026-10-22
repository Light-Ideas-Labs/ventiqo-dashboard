"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

const SIZE_CLASSES = { sm: "size-3.5", md: "size-5", lg: "size-7" };

export default function StarRating({ value, onChange, size = "md", readOnly = false }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;
  const interactive = !readOnly && Boolean(onChange);

  return (
    <div
      className={cn("flex items-center gap-0.5", interactive && "cursor-pointer")}
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            SIZE_CLASSES[size],
            star <= displayValue ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/40"
          )}
          onMouseEnter={() => interactive && setHovered(star)}
          onClick={() => interactive && onChange?.(star)}
        />
      ))}
    </div>
  );
}
