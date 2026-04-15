import Link from "next/link";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 mb-10 pb-6 border-b border-[#0B1B22]/10">
      <div>
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#1A6B7A] mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="heading-serif text-4xl text-[#0B1B22]">{title}</h1>
        {description && (
          <p className="text-sm text-[#0B1B22]/60 mt-2 max-w-xl">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="bg-[#0B1B22] text-[#F5EFE3] px-6 py-3 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C9A24B] hover:text-[#0B1B22] transition-colors whitespace-nowrap"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
