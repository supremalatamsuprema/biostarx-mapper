import { cn } from "@/lib/utils";
import { Upload, CheckCircle } from "lucide-react";

interface FileUploadProps {
  label: string;
  fileName: string;
  onChange: (fileName: string) => void;
  accept?: string;
  className?: string;
}

export function FileUpload({ 
  label, 
  fileName, 
  onChange, 
  accept = "image/*",
  className 
}: FileUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file.name);
    }
  };

  return (
    <div className={cn(
      "p-4 bg-white/50 dark:bg-card/50 border border-muted rounded-md flex flex-col gap-2",
      className
    )}>
      <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest block">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input 
            type="file" 
            accept={accept} 
            onChange={handleChange}
            className="hidden"
            data-testid={`file-${label.toLowerCase().replace(/\s+/g, '-')}`}
          />
          <div className="flex items-center gap-2 py-1.5 px-4 bg-foreground text-background rounded-full text-[9px] font-bold">
            <Upload className="w-3 h-3" />
            Seleccionar
          </div>
        </label>
      </div>
      {fileName && (
        <div className="flex items-center gap-1.5 text-[8px] text-green-600 dark:text-green-400 font-bold">
          <CheckCircle className="w-3 h-3" />
          <span className="truncate">{fileName}</span>
        </div>
      )}
    </div>
  );
}
