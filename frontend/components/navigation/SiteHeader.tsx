"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/lib/content/nav";
import { AuthHeaderActions } from "@/components/auth/AuthHeaderActions";
import { Logo } from "@/components/navigation/Logo";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() || "/";

  return (
    <header className="site-header sticky top-0 z-50">
      <Container className="site-header__inner grid h-[4.15rem] grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-4">
        {/* Left — brand */}
        <div className="min-w-0 justify-self-start">
          <Logo />
        </div>

        {/* Center — primary links */}
        <nav
          className="hidden min-w-0 justify-self-center md:block"
          aria-label="Primary"
        >
          <ul className="m-0 flex list-none items-center justify-center gap-1 lg:gap-1.5 p-0">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "nav-link inline-flex items-center rounded-md px-2.5 py-2 text-[0.8125rem] font-semibold tracking-wide lg:px-3",
                      active && "nav-link--active",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right — account + mobile */}
        <div className="flex items-center justify-end gap-2 justify-self-end sm:gap-3">
          <div className="hidden md:block">
            <AuthHeaderActions />
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
