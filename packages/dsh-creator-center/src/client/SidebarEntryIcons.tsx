interface SidebarIconProps {
  readonly className?: string
}

export function ExtensionCenterIcon({ className }: SidebarIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.25" y="2.25" width="4.25" height="4.25" rx="1.15" />
      <rect x="9.5" y="2.25" width="4.25" height="4.25" rx="1.15" />
      <rect x="2.25" y="9.5" width="4.25" height="4.25" rx="1.15" />
      <path d="M11.625 9.5v4.25M9.5 11.625h4.25" />
    </svg>
  )
}

export function MyExtensionsIcon({ className }: SidebarIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.25 5.25h11.5v7.15a1.35 1.35 0 0 1-1.35 1.35H3.6a1.35 1.35 0 0 1-1.35-1.35V5.25Z" />
      <path d="M1.75 2.25h12.5v3H1.75zM6 8.25h4" />
    </svg>
  )
}
