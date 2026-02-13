import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface FeatureToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isPrimary?: boolean;
  description?: string;
  className?: string;
}

export function FeatureToggle({ 
  label, 
  checked, 
  onChange, 
  isPrimary = false,
  description,
  className 
}: FeatureToggleProps) {
  return (
    <label 
      className={cn(
        "flex items-center gap-3 p-3 rounded-md border-2 cursor-pointer hover-elevate",
        checked 
          ? isPrimary 
            ? "border-[#A12944] bg-[#A12944]/5" 
            : "border-foreground bg-muted/50"
          : "border-muted",
        className
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          "w-4 h-4 rounded-full",
          isPrimary ? "data-[state=checked]:bg-[#A12944] data-[state=checked]:border-[#A12944]" : ""
        )}
        data-testid={`checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
      <div className="flex flex-col">
        <span className={cn(
          "text-[12px] uppercase tracking-wider font-bold",
          checked ? "text-foreground" : "text-muted-foreground"
        )}>
          {label}
        </span>
        {description && (
          <span className="text-[8px] text-muted-foreground mt-0.5">{description}</span>
        )}
      </div>
    </label>
  );
}
