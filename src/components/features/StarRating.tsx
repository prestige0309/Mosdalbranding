import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
}

const StarRating = ({ rating, max = 5, size = "md" }: StarRatingProps) => {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`${iconSize} ${
            i < rating ? "fill-brand-orange text-brand-orange" : "fill-none text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
