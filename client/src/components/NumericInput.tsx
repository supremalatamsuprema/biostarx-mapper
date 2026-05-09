import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NumericInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  min?: number;
  max?: number;
  className?: string;
}

export function NumericInput({ 
  label, 
  value, 
  onChange, 
  prefix = "",
  min = 0,
  max,
  className 
}: NumericInputProps) {
  const safeValue = value ?? 0;
  const [display, setDisplay] = useState(safeValue === 0 ? '' : safeValue.toString());
  
  useEffect(() => { 
    const v = value ?? 0;
    setDisplay(v === 0 ? '' : v.toString()); 
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplay(val);
    const parsed = parseInt(val) || 0;
    const clamped = Math.max(min, max !== undefined ? Math.min(parsed, max) : parsed);
    onChange(clamped);
  };

  return (
    <div className={cn("flex flex-col gap-1.5 group", className)}>
      <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest ml-1 whitespace-nowrap">
        {label}
      </label>
      <div className="flex items-center transition-transform duration-200 group-focus-within:scale-[1.02]">
        {prefix && <span className="text-muted-foreground font-bold mr-1">{prefix}</span>}
        <input 
          type="number" 
          className={cn(
            "w-full border-b-2 border-muted bg-transparent py-1.5 outline-none",
            "font-bold text-lg transition-colors placeholder-muted-foreground/30",
            "focus:border-[#A12944] dark:focus:border-[#A12944]"
          )}
          value={display} 
          onChange={handleChange}
          placeholder="0"
          min={min}
          max={max}
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </div>
    </div>
  );
}
