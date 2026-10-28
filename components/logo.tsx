import Image from "next/image";
import sedavelLogo from "@/sedavel-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image src={sedavelLogo} width={36} height={36} alt="" className="h-9 w-9 shrink-0 rounded-xl" />
      <span className="text-xl font-semibold tracking-tight text-slate-900">Sedavel</span>
    </span>
  );
}
