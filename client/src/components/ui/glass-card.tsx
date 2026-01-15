import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-md shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
