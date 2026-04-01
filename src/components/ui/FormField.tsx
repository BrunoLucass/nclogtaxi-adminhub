import type { InputHTMLAttributes } from 'react';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function FormField({ label, hint, ...props }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold tracking-widest text-muted uppercase ml-1">{label}</label>
      <input
        className="w-full h-11 bg-surface-dim text-on-surface text-sm px-4 border border-white/5 focus:border-brand-gold/60 transition-all outline-none rounded-xl placeholder:text-muted/50 disabled:opacity-50"
        {...props}
      />
      {hint && <p className="text-[10px] text-muted ml-1">{hint}</p>}
    </div>
  );
}
