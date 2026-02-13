import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PillButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "outline";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function PillButton({ 
  children, 
  className, 
  variant = "default", 
  onClick,
  disabled,
  type = "button"
}: PillButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full font-medium font-['Noto_Sans_KR'] text-xs tracking-widest uppercase",
        className
      )}
    >
      {children}
    </Button>
  );
}
