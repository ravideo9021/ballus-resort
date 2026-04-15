"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteSubscriber } from "../actions";

export function DeleteSubscriberButton({ id }: { id: number }) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm("Remove this subscriber?")) return;
        await deleteSubscriber(id);
        toast.success("Removed");
      }}
      className="text-red-600 hover:text-red-700"
      aria-label="Delete subscriber"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
