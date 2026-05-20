import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PremiumSelectOption = {
  value: string;
  label: string;
};

type PremiumSelectProps<TValue extends string> = {
  value: TValue;
  options: readonly PremiumSelectOption[];
  onValueChange: (value: TValue) => void;
  placeholder?: string;
  className?: string;
};

export function PremiumSelect<TValue extends string>({
  value,
  options,
  onValueChange,
  placeholder,
  className,
}: PremiumSelectProps<TValue>) {
  return (
    <Select value={value} onValueChange={(nextValue) => onValueChange(nextValue as TValue)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
