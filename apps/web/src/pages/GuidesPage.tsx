import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Search,
} from "lucide-react";
import { Fragment, type ReactNode, useEffect, useMemo, useState } from "react";
import { GUIDES } from "../data/guides";
import { Link, useRouter } from "../lib/router";

const CATEGORY_TABS = [
  "all",
  "AI Agent Infrastructure",
  "Sandbox Fundamentals",
  "Cost & Economics",
  "Security & Isolation",
  "Self-hosted Sandbox",
  "Browser Automation",
];

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
const INLINE_LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;
const TABLE_BLOCK = /^\|.*\|$/m;

function renderInline(text: string): ReactNode[] {
  return text
    .split(INLINE_PATTERN)
    .filter((part) => part !== "")
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong className="font-semibold text-[#F2F3FA]" key={index}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            className="rounded border border-[#262C4A] bg-[#1A1E32] px-1.5 py-0.5 font-mono text-[#C4B5FD] text-[0.92em]"
            key={index}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      const link = part.match(INLINE_LINK);
      if (link) {
        return (
          <a
            className="text-[#A78BFA] underline underline-offset-2 hover:text-[#C4B5FD]"
            href={link[2]}
            key={index}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link[1]}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
}

const ORDERED_LINE = /^\d+\.\s+/;
const BULLET_LINE = /^[-*]\s+/;

function renderLines(lines: string[], keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const current = lines[index].trim();
    const start = index;

    if (BULLET_LINE.test(current)) {
      const items: string[] = [];
      while (index < lines.length && BULLET_LINE.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(BULLET_LINE, ""));
        index += 1;
      }
      nodes.push(
        <ul
          className="list-disc space-y-2 pl-5 marker:text-[#8289AA]"
          key={`${keyPrefix}-ul-${start}`}
        >
          {items.map((item, itemIndex) => (
            <li className="pl-1" key={`${keyPrefix}-ul-${start}-${itemIndex}`}>
              {renderInline(item)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (ORDERED_LINE.test(current)) {
      const items: string[] = [];
      while (index < lines.length && ORDERED_LINE.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(ORDERED_LINE, ""));
        index += 1;
      }
      nodes.push(
        <ol
          className="list-decimal space-y-2 pl-5 marker:text-[#8289AA]"
          key={`${keyPrefix}-ol-${start}`}
        >
          {items.map((item, itemIndex) => (
            <li className="pl-1" key={`${keyPrefix}-ol-${start}-${itemIndex}`}>
              {renderInline(item)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      !(BULLET_LINE.test(lines[index].trim()) || ORDERED_LINE.test(lines[index].trim()))
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    nodes.push(
      <p key={`${keyPrefix}-p-${start}`}>
        {paragraph.map((line, lineIndex) => (
          <span className="block" key={`${keyPrefix}-p-${start}-${lineIndex}`}>
            {renderInline(line)}
          </span>
        ))}
      </p>,
    );
  }

  return nodes;
}

const NEW_WINDOW_DAYS = 60;

/** A guide is "new" while it is still inside the recent-publication window. */
function isNewGuide(guide: { publishedAt: string }): boolean {
  const published = new Date(guide.publishedAt).getTime();
  if (Number.isNaN(published)) {
    return false;
  }
  return Date.now() - published < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

/** Stable anchor id for a heading; headings are unique enough within a guide. */
function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Minimal markdown: headings, code fences, tables, lists, rules, inline emphasis. */
function renderBlocks(markdown: string): ReactNode[] {
  return markdown
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, blockIndex) => {
      if (block.startsWith("```")) {
        const cleaned = block.replace(/```[a-z]*\n?/g, "").trimEnd();
        return (
          <div
            className="my-4 overflow-x-auto rounded-[12px] border border-[#262C4A] bg-[#080B1A] p-4"
            key={blockIndex}
          >
            <pre className="font-mono text-[#C4B5FD] text-xs leading-relaxed">
              <code>{cleaned}</code>
            </pre>
          </div>
        );
      }

      if (TABLE_BLOCK.test(block)) {
        const rows = block.split("\n").filter((row) => row.trim() !== "");
        const columnsOf = (row: string) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell.length > 0);
        const header = columnsOf(rows[0]);
        const body = rows.slice(2);

        return (
          <div
            className="my-4 overflow-x-auto rounded-[12px] border border-[#262C4A] bg-[#131625]"
            key={blockIndex}
          >
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-[#151A35] font-bold text-[#F2F3FA]">
                  {header.map((cell, cellIndex) => (
                    <th className="p-3 align-top" key={`${blockIndex}-h-${cellIndex}`} scope="col">
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, rowIndex) => (
                  <tr
                    className="border-[#262C4A] border-t text-[#C7CCE2]"
                    key={`${blockIndex}-r-${rowIndex}`}
                  >
                    {columnsOf(row).map((cell, cellIndex) => (
                      <td
                        className="p-3 align-top"
                        key={`${blockIndex}-r-${rowIndex}-${cellIndex}`}
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      if (block.startsWith("---")) {
        return <hr className="my-6 border-[#262C4A]" key={blockIndex} />;
      }

      const lines = block.split("\n").filter((line) => line.trim() !== "");
      const first = lines[0];

      // Headings own only their first line; the rest is body content.
      if (first.startsWith("### ")) {
        return (
          <Fragment key={blockIndex}>
            <h3 className="pt-4 font-bold text-[#F2F3FA] text-base">
              {renderInline(first.slice(4))}
            </h3>
            {renderLines(lines.slice(1), `b${blockIndex}`)}
          </Fragment>
        );
      }

      if (first.startsWith("## ")) {
        return (
          <Fragment key={blockIndex}>
            <h2
              className="scroll-mt-24 border-[#262C4A] border-b pt-8 pb-2 font-bold text-[#F2F3FA] text-lg"
              id={headingId(first.slice(3))}
            >
              {renderInline(first.slice(3))}
            </h2>
            {renderLines(lines.slice(1), `b${blockIndex}`)}
          </Fragment>
        );
      }

      return <Fragment key={blockIndex}>{renderLines(lines, `b${blockIndex}`)}</Fragment>;
    });
}

export function GuidesPage() {
  const { route } = useRouter();
  const slug = route.params.slug;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newestFirst, setNewestFirst] = useState(false);

  const activeArticle = slug ? GUIDES.find((g) => g.slug === slug || g.id === slug) : null;

  const toc = useMemo(
    () =>
      activeArticle
        ? activeArticle.contentMarkdown
            .split("\n")
            .filter((line) => line.startsWith("## "))
            .map((line) => {
              const text = line.slice(3).trim();
              return { id: headingId(text), text };
            })
        : [],
    [activeArticle],
  );

  const [activeHeading, setActiveHeading] = useState<string>("");

  // Highlight the section the reader is actually inside, so the TOC doubles
  // as a position indicator rather than a plain link list.
  useEffect(() => {
    if (toc.length === 0) {
      return;
    }

    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) {
      return;
    }

    const passed = headings.filter((heading) => heading.getBoundingClientRect().top < 160).at(-1);
    setActiveHeading(passed?.id ?? toc[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (current) {
          setActiveHeading(current.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [toc]);

  if (activeArticle) {
    return (
      <article className="mx-auto max-w-3xl space-y-8 pt-6 pb-20 xl:max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#9BA1BE] text-xs">
          <Link className="transition-colors hover:text-[#F2F3FA]" to="/">
            Home
          </Link>
          <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#8289AA]" />
          <Link className="transition-colors hover:text-[#F2F3FA]" to="/guides">
            Guides
          </Link>
          <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#8289AA]" />
          <span className="max-w-xs truncate font-medium text-[#F2F3FA]">
            {activeArticle.title}
          </span>
        </nav>

        <header className="space-y-4 border-[#262C4A] border-b pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-[#6D4DFF]/35 bg-[#1E183E] px-2.5 py-0.5 font-semibold text-[#A78BFA]">
              {activeArticle.category}
            </span>
            {isNewGuide(activeArticle) && (
              <span className="rounded-full border border-[#22C55E]/40 bg-[#052E16] px-2 py-0.5 font-semibold text-[#86EFAC] text-[10px] uppercase tracking-[0.06em]">
                New
              </span>
            )}
            <span className="text-[#8289AA]">·</span>
            <span className="flex items-center gap-1 text-[#9BA1BE]">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              {activeArticle.readTime}
            </span>
            <span className="text-[#8289AA]">·</span>
            <span className="flex items-center gap-1 text-[#9BA1BE]">
              <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
              {activeArticle.publishedAt}
            </span>
          </div>

          <h1 className="text-balance font-extrabold text-2xl text-[#F2F3FA] leading-tight tracking-tight sm:text-3xl">
            {activeArticle.title}
          </h1>

          <p className="text-[#C7CCE2] text-[15px] leading-relaxed">{activeArticle.summary}</p>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#6D4DFF] to-[#A78BFA] font-bold text-white text-xs">
              {activeArticle.author.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-xs">
              <div className="font-semibold text-[#F2F3FA]">{activeArticle.author.name}</div>
              <div className="text-[#9BA1BE]">{activeArticle.author.role}</div>
            </div>
          </div>
        </header>

        {toc.length > 0 && (
          <details className="rounded-[12px] border border-[#262C4A] bg-[#131625] px-4 py-3 xl:hidden">
            <summary className="cursor-pointer font-semibold text-[#9BA1BE] text-[12px]">
              On this page ({toc.length} sections)
            </summary>
            <ol className="mt-2 space-y-1.5">
              {toc.map((item, index) => (
                <li key={item.id}>
                  <a
                    className="flex gap-2 text-[#C7CCE2] text-[13px] leading-[20px] hover:text-[#A78BFA]"
                    href={`#${item.id}`}
                  >
                    <span className="font-mono text-[#5F6788] text-[11px] tabular-nums">
                      {index + 1}
                    </span>
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ol>
          </details>
        )}

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_190px]">
          <section className="max-w-[68ch] space-y-5 text-[#C7CCE2] text-[15px] leading-7">
            {renderBlocks(activeArticle.contentMarkdown)}
          </section>

          <aside className="hidden xl:block">
            <nav
              aria-label="On this page"
              className="sticky top-[84px] space-y-1.5 border-[#262C4A] border-l pl-4"
            >
              <p className="font-semibold text-[#8289AA] text-[10px] uppercase tracking-[0.08em]">
                On this page
              </p>
              {toc.map((item) => (
                <a
                  aria-current={activeHeading === item.id ? "location" : undefined}
                  className={`block text-[12px] leading-[18px] transition-colors hover:text-[#A78BFA] ${
                    activeHeading === item.id
                      ? "-ml-4 border-[#6D4DFF] border-l-2 pl-3.5 font-medium text-[#C4B5FD]"
                      : "text-[#9BA1BE]"
                  }`}
                  href={`#${item.id}`}
                  key={item.id}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-[#262C4A] border-t pt-8">
          <Link
            className="inline-flex items-center gap-1.5 rounded-full border border-[#262C4A] bg-[#131625] px-4 py-2 font-semibold text-[#C7CCE2] text-xs transition-colors hover:border-[#3A4370] hover:bg-[#1A1E32]"
            to="/guides"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Back to all guides</span>
          </Link>
          <Link
            className="inline-flex items-center gap-1.5 rounded-full bg-[#6D4DFF] px-4 py-2 font-semibold text-white text-xs transition-colors hover:bg-[#7B5EFF]"
            to="/compare"
          >
            <span>Compare infrastructure</span>
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </footer>
      </article>
    );
  }

  const filteredGuides = GUIDES.filter((guide) => {
    const matchesCategory = selectedCategory === "all" || guide.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      query === "" ||
      guide.title.toLowerCase().includes(query) ||
      guide.summary.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  }).sort((a, b) => (newestFirst ? b.publishedAt.localeCompare(a.publishedAt) : 0));

  return (
    <div className="space-y-8 pt-6 pb-20">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-[#262C4A] border-b pb-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 font-semibold text-[#A78BFA] text-xs uppercase tracking-wider">
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            <span>Architecture &amp; engineering</span>
          </div>
          <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight md:text-3xl">
            Sandbox technical guides
          </h1>
          <p className="mt-1 max-w-2xl text-[#9BA1BE] text-sm">
            In-depth guides on Firecracker virtualization, gVisor isolation, agent execution
            architecture, and cost optimization.
          </p>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative min-w-0 flex-1 md:w-72">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8289AA]"
            />
            <input
              aria-label="Search guides"
              className="w-full rounded-[12px] border border-[#262C4A] bg-[#131625] py-2 pr-4 pl-9 text-[#F2F3FA] text-xs transition-colors placeholder:text-[#8289AA] hover:border-[#3A4370] focus:border-[#6D4DFF] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search guides..."
              type="search"
              value={searchQuery}
            />
          </div>
          <button
            aria-pressed={newestFirst}
            className={`shrink-0 cursor-pointer rounded-[12px] border px-3 py-2 font-medium text-xs transition-colors ${
              newestFirst
                ? "border-[#6D4DFF] bg-[#1E183E] text-[#C4B5FD]"
                : "border-[#262C4A] bg-[#131625] text-[#9BA1BE] hover:border-[#3A4370] hover:text-[#F2F3FA]"
            }`}
            onClick={() => setNewestFirst((prev) => !prev)}
            type="button"
          >
            Newest first
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORY_TABS.map((category) => (
          <button
            aria-pressed={selectedCategory === category}
            className={`cursor-pointer whitespace-nowrap rounded-lg border px-3 py-1.5 font-medium text-xs transition-colors ${
              selectedCategory === category
                ? "border-[#6D4DFF] bg-[#6D4DFF] text-white shadow-[0_2px_14px_rgba(109,77,255,0.35)]"
                : "border-[#262C4A] bg-[#131625] text-[#C7CCE2] hover:bg-[#1A1E32] hover:text-[#F2F3FA]"
            }`}
            key={category}
            onClick={() => setSelectedCategory(category)}
            type="button"
          >
            {category === "all" ? "All guides" : category}
          </button>
        ))}
      </div>

      {/* Guides */}
      {filteredGuides.length === 0 ? (
        <div className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1E32] text-[#9BA1BE]">
            <Search aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold text-[#F2F3FA] text-base">No guides found</h2>
            <p className="mx-auto max-w-sm text-[#9BA1BE] text-xs">
              Nothing matches “{searchQuery || selectedCategory}”. Try a different search or
              category.
            </p>
          </div>
          <button
            className="cursor-pointer rounded-full bg-[#6D4DFF] px-4 py-2 font-semibold text-white text-xs transition-colors hover:bg-[#7B5EFF]"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            type="button"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <Link
              className="group flex flex-col justify-between rounded-[14px] border border-[#262C4A] bg-[#131625] p-5 transition-colors hover:border-[#3A4370] hover:bg-[#171B2E]"
              key={guide.id}
              to={`/guides/${guide.slug}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#A78BFA] text-[11px] uppercase tracking-wider">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-2">
                    {isNewGuide(guide) && (
                      <span className="rounded-full border border-[#22C55E]/40 bg-[#052E16] px-1.5 py-0.5 font-semibold text-[#86EFAC] text-[10px] uppercase tracking-[0.06em]">
                        New
                      </span>
                    )}
                    <span className="font-mono text-[#8289AA] text-[11px]">{guide.readTime}</span>
                  </span>
                </div>

                <h2 className="text-balance font-bold text-[#F2F3FA] text-[15px] leading-snug transition-colors group-hover:text-[#A78BFA]">
                  {guide.title}
                </h2>

                <p className="line-clamp-3 text-[#9BA1BE] text-xs leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-[#262C4A]/80 border-t pt-4 text-xs">
                <span className="font-medium text-[#9BA1BE]">{guide.author.name}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#A78BFA] transition-transform group-hover:translate-x-0.5">
                  <span>Read guide</span>
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
