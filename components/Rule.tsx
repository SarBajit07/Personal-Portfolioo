/** A 1px hairline. The only separator on this site — box-shadow is banned. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <hr className={`border-0 border-t border-t-rule ${className}`} aria-hidden />
  );
}
