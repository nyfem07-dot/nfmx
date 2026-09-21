import {
  Image as ImageIcon,
  FileText,
  QrCode,
  Calculator,
  KeyRound,
  Combine,
  Type,
  Braces,
  Ruler,
  Scaling,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const icons = [
  ImageIcon,
  FileText,
  QrCode,
  Calculator,
  KeyRound,
  Combine,
  Type,
  Braces,
  Ruler,
  Scaling,
  RefreshCw,
  ShieldCheck,
];

export function HeroMosaic() {
  return (
    <div
      className="grid grid-cols-4 gap-2.5 sm:grid-cols-4"
      role="presentation"
      aria-hidden="true"
    >
      {icons.map((Icon, i) => {
        const isAccent = i === 2 || i === 9;
        return (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-[8px] border ${
              isAccent
                ? "border-brass/40 bg-brass-tint text-brass"
                : "border-border bg-paper-raised text-ink-faint"
            }`}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
          </div>
        );
      })}
    </div>
  );
}
