import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type Common = {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
};

const shell =
  "mt-2 w-full border-0 border-b border-b-rule bg-transparent px-0 py-2 text-body text-ink outline-none placeholder:text-ink-3 focus:border-b-accent";

function Frame({
  id,
  label,
  error,
  hint,
  children,
}: Common & { children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-2 text-note text-ink-3">{hint}</p>
      ) : null}
      {/* Errors sit inline under the field they belong to — never a toast. */}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-note text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Field({
  id,
  label,
  error,
  hint,
  ...props
}: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Frame id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={shell}
        {...props}
      />
    </Frame>
  );
}

export function TextField({
  id,
  label,
  error,
  hint,
  ...props
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Frame id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        name={id}
        rows={6}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${shell} resize-y`}
        {...props}
      />
    </Frame>
  );
}
