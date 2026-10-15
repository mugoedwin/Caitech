import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/** High-res official mark (public/brand/caitech-logo.png). */
const LOGO_W = 640;
const LOGO_H = 640;

type LogoProps = {
  className?: string;
  inverse?: boolean;
  compact?: boolean;
  showWordmark?: boolean;
};

/**
 * Official CAITECH emblem + clean wordmark lockup.
 * Uses the real brand PNG (gear + orange skyline) at crisp navbar scale —
 * not a reinvented monogram.
 */
export function Logo({
  className,
  inverse = false,
  compact = false,
  showWordmark = true,
}: LogoProps) {
  const mark = compact ? 34 : 40;

  return (
    <Link
      href="/"
      className={cn(
        "logo-mark group no-underline",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
        inverse
          ? "focus-visible:outline-[var(--color-lime)]"
          : "focus-visible:outline-[var(--color-cyan)]",
        className,
      )}
      aria-label="CAITECH Global Institute — home"
    >
      <span
        className={cn(
          "logo-mark__image-wrap",
          inverse && "bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.2)]",
        )}
        style={{ height: mark, width: mark }}
      >
        <Image
          src="/brand/caitech-logo.png"
          alt=""
          width={LOGO_W}
          height={LOGO_H}
          priority
          className="h-full w-full object-contain"
          sizes={`${mark}px`}
        />
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "logo-mark__text",
            inverse && "border-[color-mix(in_oklab,white_28%,transparent)]",
          )}
        >
          <span className={cn("logo-mark__name", inverse && "text-white")}>
            CAITECH
          </span>
          <span className={cn("logo-mark__sub", inverse && "text-white/70")}>
            Global Institute
          </span>
        </span>
      ) : null}
    </Link>
  );
}
