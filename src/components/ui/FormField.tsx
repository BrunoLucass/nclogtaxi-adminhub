import { useId, type InputHTMLAttributes } from 'react';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function FormField({ label, hint, id: externalId, ...props }: FormFieldProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[10px] font-bold tracking-widest text-muted uppercase ml-1">{label}</label>
      <input
        id={id}
        aria-describedby={hintId}
        className="w-full h-11 bg-surface-dim text-on-surface text-sm px-4 border border-white/5 focus:border-brand-gold/60 transition-all outline-none rounded-xl placeholder:text-muted/50 disabled:opacity-50"
        {...props}
      />
      {hint && <p id={hintId} className="text-[10px] text-muted ml-1">{hint}</p>}
    </div>
  );
}
