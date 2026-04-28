import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

type RichNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
  content?: RichNode[];
};

function parseContent(content: unknown): { kind: "html"; value: string } | { kind: "json"; value: RichNode } | { kind: "text"; value: string } | null {
  if (!content) return null;

  if (typeof content === "string") {
    const trimmed = content.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("<")) return { kind: "html", value: trimmed };
    try {
      return { kind: "json", value: JSON.parse(trimmed) as RichNode };
    } catch {
      return { kind: "text", value: trimmed };
    }
  }

  if (typeof content === "object") {
    return { kind: "json", value: content as RichNode };
  }

  return null;
}

function renderMarkedText(node: RichNode, key: string) {
  const marks = node.marks ?? [];
  let output: React.ReactNode = node.text ?? "";

  for (const mark of marks) {
    if (mark.type === "bold") {
      output = <strong key={`${key}-bold`}>{output}</strong>;
    } else if (mark.type === "italic") {
      output = <em key={`${key}-italic`}>{output}</em>;
    } else if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
      output = (
        <a
          key={`${key}-link`}
          href={href}
          className="text-[#1A6B7A] underline"
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
        >
          {output}
        </a>
      );
    }
  }

  return output;
}

function renderNodes(nodes: RichNode[] | undefined, keyPrefix: string): React.ReactNode {
  if (!nodes?.length) return null;

  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;

    if (node.type === "text") {
      return <span key={key}>{renderMarkedText(node, key)}</span>;
    }

    if (node.type === "paragraph") {
      return (
        <p key={key} className="mb-4 text-lg leading-relaxed text-[#0B1B22]/80">
          {renderNodes(node.content, key)}
        </p>
      );
    }

    if (node.type === "heading") {
      const level = Number(node.attrs?.level) || 2;
      const Tag = level === 3 ? "h3" : "h2";
      return (
        <Tag key={key} className="heading-serif mb-5 text-3xl text-[#0B1B22]">
          {renderNodes(node.content, key)}
        </Tag>
      );
    }

    if (node.type === "bulletList") {
      return (
        <ul key={key} className="mb-6 space-y-3">
          {renderNodes(node.content, key)}
        </ul>
      );
    }

    if (node.type === "orderedList") {
      return (
        <ol key={key} className="mb-6 list-decimal space-y-3 pl-6">
          {renderNodes(node.content, key)}
        </ol>
      );
    }

    if (node.type === "listItem") {
      return (
        <li key={key} className="flex gap-3 text-lg text-[#0B1B22]/80">
          <span className="mt-4 h-px w-5 flex-shrink-0 bg-[#C9A24B]" />
          <span>{renderNodes(node.content, key)}</span>
        </li>
      );
    }

    if (node.type === "blockquote") {
      return (
        <blockquote key={key} className="my-10 border-l-2 border-[#C9A24B] pl-6">
          {renderNodes(node.content, key)}
        </blockquote>
      );
    }

    if (node.type === "image") {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      if (!src) return null;
      return (
        <Image
          key={key}
          src={src}
          alt={alt}
          width={1200}
          height={800}
          sizes="(min-width: 1024px) 960px, 100vw"
          className="my-8 w-full object-cover"
        />
      );
    }

    return <div key={key}>{renderNodes(node.content, key)}</div>;
  });
}

export function extractTextContent(content: unknown): string {
  const parsed = parseContent(content);
  if (!parsed) return "";
  if (parsed.kind === "text") return parsed.value;
  if (parsed.kind === "html") return parsed.value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const walk = (node: RichNode | undefined): string => {
    if (!node) return "";
    if (node.type === "text") return node.text ?? "";
    return (node.content ?? []).map(walk).join(" ");
  };

  return walk(parsed.value).replace(/\s+/g, " ").trim();
}

export function RichContent({ content }: { content: unknown }) {
  const parsed = parseContent(content);
  if (!parsed) return null;

  if (parsed.kind === "html") {
    const safe = DOMPurify.sanitize(parsed.value, {
      ALLOWED_TAGS: [
        "p", "br", "strong", "em", "b", "i", "u", "s",
        "h1", "h2", "h3", "h4",
        "ul", "ol", "li",
        "blockquote",
        "a", "img",
        "hr",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"],
    });
    return (
      <div
        className="prose prose-lg prose-resort max-w-none text-[#0B1B22]/80"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  if (parsed.kind === "text") {
    return <p className="text-lg leading-relaxed text-[#0B1B22]/80">{parsed.value}</p>;
  }

  return <div>{renderNodes(parsed.value.content, "rich")}</div>;
}
