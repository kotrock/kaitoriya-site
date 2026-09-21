// Stroke-based SVG icon set, sized via className (e.g. "w-6 h-6"), colored via currentColor.

export function TruckIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 6h11v10H2z" />
      <path d="M13 10h4l4 3.5V16h-8z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </svg>
  );
}

export function SearchIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </svg>
  );
}

export function BoxIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8l9-4.5L21 8l-9 4.5L3 8z" />
      <path d="M3 8v9l9 4.5V12.5" />
      <path d="M21 8v9l-9 4.5" />
    </svg>
  );
}

export function LockIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "w-8 h-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

export function HeartIcon({ className = "w-9 h-9" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20s-7.5-4.6-10-9.3C0.4 7.7 2 4.5 5.3 4a4.7 4.7 0 0 1 6.7 2 4.7 4.7 0 0 1 6.7-2c3.3.5 4.9 3.7 3.3 6.7C19.5 15.4 12 20 12 20z" />
    </svg>
  );
}

export function StarIcon({ className = "w-4 h-4", filled = true }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.4l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.5z" />
    </svg>
  );
}

export function PhoneIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 4h3.2l1.3 4.5-2 1.5a11.5 11.5 0 0 0 5.5 5.5l1.5-2 4.5 1.3V18a2 2 0 0 1-2 2h-.5C9.5 20 4 14.5 4 7.5V7a2 2 0 0 1 1-3z" />
    </svg>
  );
}

export function LineIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.2c0-4.3-4.3-7.7-9-7.7s-9 3.4-9 7.7c0 3.8 3.4 7 8 7.6.3.1.7.2.8.6.1.3.1.7 0 1l-.2 1c0 .3-.2 1 .9.6a33 33 0 0 0 5.2-3.9c1.6-1.5 3.3-3.4 3.3-6.9z" />
      <path d="M9 9.5v4.2" />
      <path d="M12 9.5v4.2l2.4-4.2v4.2" />
      <path d="M17.5 9.5v4.2h1.8" />
    </svg>
  );
}

export function StarRating({ count = 5, className = "w-4 h-4" }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`評価 ${count}段階中${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} className={className} />
      ))}
    </div>
  );
}
