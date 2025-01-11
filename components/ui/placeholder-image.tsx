export function PlaceholderImage() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <svg
        className="w-12 h-12 text-muted-foreground"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M20.4 14.5 16 10 4 20" />
      </svg>
    </div>
  );
} 