"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

export function StickyFormFooter({
  cancelHref,
  submitLabel = "Save Changes",
  deleteAction,
  deleteLabel = "Delete",
}: {
  cancelHref: string;
  submitLabel?: string;
  deleteAction?: () => void;
  deleteLabel?: string;
}) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#0B1B22]/10 px-10 py-4 flex items-center justify-between -mx-10 mt-10">
      <div>
        {deleteAction && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure? This cannot be undone.")) deleteAction();
            }}
            className="text-xs uppercase tracking-[0.2em] text-red-600 hover:text-red-700 font-semibold"
          >
            {deleteLabel}
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={cancelHref}
          className="px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#0B1B22]/70 hover:text-[#0B1B22]"
        >
          Cancel
        </Link>
        <SubmitButton label={submitLabel} />
      </div>
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#0B1B22] text-[#F5EFE3] px-8 py-2.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#C9A24B] hover:text-[#0B1B22] transition-colors disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}
