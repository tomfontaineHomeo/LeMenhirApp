export function MenhirMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 4C18 4 12 10 10 20C8 30 9 46 9 54C9 58.4183 12.134 60 16 60H32C35.866 60 39 58.4183 39 54C39 46 40 30 38 20C36 10 30 4 30 4C27 2 21 2 18 4Z"
        fill="currentColor"
      />
      <path
        d="M9 54C9 58.4183 12.134 60 16 60H32C35.866 60 39 58.4183 39 54"
        stroke="var(--menhir-yellow)"
        strokeWidth="2"
      />
    </svg>
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-bold ${className}`}
    >
      <MenhirMark className="h-7 w-7 text-menhir-yellow" />
      <span>
        LeMenhir<span className="text-menhir-yellow">App</span>
      </span>
    </span>
  );
}
