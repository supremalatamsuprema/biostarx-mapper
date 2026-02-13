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
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-primary-border min-h-9 px-4 py-2 rounded-full font-medium font-['Noto_Sans_KR'] text-xs tracking-widest uppercase w-full bg-[#a12944] text-[#fdf7f8]"
    >
      {children}
    </Button>
  );
}
