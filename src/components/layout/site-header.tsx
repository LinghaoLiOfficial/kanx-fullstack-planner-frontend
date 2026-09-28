import Link from "next/link";
import Image from "next/image";
import { GitBranch } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 mb-8">
      <div className="rounded-full border border-border/70 bg-background/80 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt={env.NEXT_PUBLIC_APP_NAME}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
              priority
            />
            <div>
              <div className="text-sm text-muted-foreground">Project</div>
              <div className="font-medium">{env.NEXT_PUBLIC_APP_NAME}</div>
            </div>
          </Link>

          <div className="hidden items-center gap-4 lg:flex">
            {siteConfig.marketingNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href={siteConfig.links.repo} target="_blank">
                <GitBranch className="size-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
