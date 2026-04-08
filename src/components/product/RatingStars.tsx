import { Star } from 'lucide-react';

type RatingStarsProps = {
  rating: number;
  className?: string;
  filledClassName?: string;
  emptyClassName?: string;
  total?: number;
};

export default function RatingStars({
  rating,
  className = 'w-4 h-4',
  filledClassName = 'text-accent fill-accent',
  emptyClassName = 'text-muted-foreground/20',
  total = 5,
}: RatingStarsProps) {
  return Array.from({ length: total }).map((_, index) => (
    <Star
      key={index}
      className={`${className} ${index < Math.floor(rating) ? filledClassName : emptyClassName}`}
    />
  ));
}
