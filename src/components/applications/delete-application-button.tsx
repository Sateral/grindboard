"use client";

import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import { deleteApplicationAction } from "@/app/actions/applications";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";

/**
 * Deletes an Application in two steps: the first click asks for
 * confirmation, the second performs it. Deleting removes the row, so days it
 * painted lose their Hit — the board always tells the truth.
 */
export function DeleteApplicationButton({
  applicationId,
}: {
  applicationId: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button
        aria-label="Delete application"
        onClick={() => setConfirming(true)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Trash2Icon aria-hidden="true" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <form action={deleteApplicationAction}>
        <input name="id" type="hidden" value={applicationId} />
        <SubmitButton pendingLabel="Deleting…" size="sm" variant="destructive">
          Confirm
        </SubmitButton>
      </form>
      <Button
        onClick={() => setConfirming(false)}
        size="sm"
        type="button"
        variant="ghost"
      >
        Cancel
      </Button>
    </div>
  );
}
