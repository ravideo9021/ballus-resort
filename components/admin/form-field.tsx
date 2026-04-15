import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, hint, error, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-xs uppercase tracking-[0.2em] text-[#0B1B22]/70 mb-2 font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[#0B1B22]/50 mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}

export const inputCls =
  "w-full px-4 py-2.5 text-sm bg-white border border-[#0B1B22]/15 text-[#0B1B22] focus:outline-none focus:border-[#C9A24B] transition-colors";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputCls, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputCls, props.className)} />;
}
