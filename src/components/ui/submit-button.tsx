"use client";

import { LoaderCircleIcon } from "lucide-react";
import type * as React from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  /** Shown beside the spinner while the action is in flight. */
  pendingLabel?: string;
};

/**
 * A form submit button that reflects the owning form's pending state with a
 * spinner. Works with any Server Action — plain `<form action={fn}>` or
 * `useActionState` — because it reads `useFormStatus` from the form context.
 */
export function SubmitButton({
  pendingLabel,
  children,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} disabled={pending} type="submit" {...props}>
      {pending ? (
        <>
          <LoaderCircleIcon
            aria-hidden="true"
            className="animate-spin"
            data-icon="inline-start"
          />
          {pendingLabel ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
