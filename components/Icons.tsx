/**
 * The handful of line icons the site needs, inline rather than from a package.
 *
 * The paths are Feather's (MIT), which is where the ThemeToggle's sun and moon
 * came from too — a 24 box, round joins, no fill. Drawing them by hand instead
 * would save nothing and get the GitHub mark subtly wrong.
 *
 * They are decorative: every one labels text that already says the same thing,
 * so they stay out of the accessibility tree and never carry meaning alone.
 */
type IconProps = { className?: string };

function Icon({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-9.1 5.7a2 2 0 0 1-1.8 0L2 7" />
    </Icon>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </Icon>
  );
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </Icon>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v1.5A5 5 0 0 1 16 8Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </Icon>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      {/* A dot, drawn as a zero-length round-capped line — the same trick
          Feather uses, so it inherits the stroke weight of its neighbours. */}
      <path d="M17.5 6.5h.01" />
    </Icon>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </Icon>
  );
}
