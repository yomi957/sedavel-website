export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 shrink-0"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" className="fill-blue-600" />
        <path
          d="M9 22.5V9.5h6.2c2.9 0 4.8 1.7 4.8 4.2 0 1.6-.8 2.9-2.1 3.6L21.2 22.5h-3.1l-2.9-4.7H12V22.5H9Zm3-7.2h3c1.4 0 2.2-.7 2.2-1.8s-.8-1.8-2.2-1.8H12v3.6Z"
          className="fill-white"
        />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-slate-900">
        Sedavel
      </span>
    </span>
  );
}
