import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code2, Database, FileJson, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { defaultLocale, getDictionary } from "@/lib/i18n";

const capabilityIcons = [FileJson, Workflow, Database, Code2] as const;

export default function MarketingPage() {
  const t = getDictionary(defaultLocale);
  const marketing = t.marketing;

  return (
    <div className="space-y-12 pb-20">
      <section className="grid min-h-[460px] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background shadow-sm">
              <Image
                src="/logo.svg"
                alt=""
                width={56}
                height={56}
                className="size-full rounded-full object-cover"
                priority
              />
            </span>
            <span className="text-3xl font-semibold tracking-normal text-foreground">
              {t.topNav.brandKicker}
            </span>
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-6xl">
              {t.app.name}
            </h1>
            <p className="max-w-2xl text-lg leading-9 text-muted-foreground">
              {t.app.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/projects">
                {marketing.enterProjects}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/projects/new">{marketing.createProject}</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden bg-card/80">
          <CardHeader>
            <CardTitle>{marketing.productLoop}</CardTitle>
            <CardDescription>{marketing.productLoopDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-[1.5rem] border border-border/60 bg-muted/40 p-4 font-mono text-xs leading-6">
              <code>{marketing.codeSample}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {marketing.capabilities.map((item, index) => {
          const Icon = capabilityIcons[index] ?? FileJson;

          return (
          <Card key={item.title} className="bg-card/80">
            <CardHeader>
              <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-secondary">
                <Icon className="size-5" />
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
          );
        })}
      </section>

      <section className="space-y-6 pb-20 pt-10 md:pt-16">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">
            {marketing.comparisonTitle}
          </h2>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            {marketing.comparisonDescription}
          </p>
        </div>

        <Card className="overflow-hidden bg-card/80">
          <CardContent className="p-0">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px]">{marketing.comparisonHeaders.point}</TableHead>
                  <TableHead>{marketing.comparisonHeaders.traditional}</TableHead>
                  <TableHead>{marketing.comparisonHeaders.agile}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketing.comparisonRows.map((item) => (
                  <TableRow key={item.point}>
                    <TableCell className="font-semibold text-foreground">
                      {item.point}
                    </TableCell>
                    <TableCell className="min-w-80 leading-7 text-muted-foreground">
                      {item.traditional}
                    </TableCell>
                    <TableCell className="min-w-96 leading-7 text-muted-foreground">
                      {item.agile}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
