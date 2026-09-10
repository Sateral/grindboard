"use client";

import { useActionState } from "react";

import {
  createApplicationAction,
  type QuickAddApplicationState,
} from "@/app/actions/applications";
import {
  pipelineStatuses,
  pipelineStatusLabels,
} from "@/lib/applications/pipeline";

const initialState: QuickAddApplicationState = {};

const fieldClassName =
  "h-9 rounded border border-white/15 bg-[#141513] px-3 text-[13px] text-[#e7e7df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2c2ba]";

export function QuickAddApplicationForm() {
  const [state, action, pending] = useActionState(
    createApplicationAction,
    initialState,
  );

  return (
    <form action={action} className="mt-4 flex flex-col gap-3">
      <input
        aria-label="Company"
        autoComplete="off"
        className={fieldClassName}
        disabled={pending}
        name="company"
        placeholder="Company"
        required
        type="text"
      />
      <input
        aria-label="Role"
        autoComplete="off"
        className={fieldClassName}
        disabled={pending}
        name="role"
        placeholder="Role"
        required
        type="text"
      />
      <input
        aria-label="Job posting URL (optional)"
        autoComplete="off"
        className={fieldClassName}
        disabled={pending}
        name="url"
        placeholder="https://… (optional)"
        type="url"
      />
      <div className="flex gap-3">
        <select
          aria-label="Pipeline status"
          className={`${fieldClassName} min-w-0 flex-1`}
          defaultValue="saved"
          disabled={pending}
          name="status"
        >
          {pipelineStatuses.map((status) => (
            <option key={status} value={status}>
              {pipelineStatusLabels[status]}
            </option>
          ))}
        </select>
        <input
          aria-label="Deadline (optional)"
          className={`${fieldClassName} min-w-0 flex-1`}
          disabled={pending}
          name="deadline"
          type="date"
        />
      </div>
      <button
        className="h-9 rounded border border-white/15 bg-white/[0.03] px-4 text-[13px] text-[#e7e7df] transition-colors hover:border-white/40 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2c2ba] disabled:pointer-events-none disabled:opacity-50"
        disabled={pending}
        type="submit"
      >
        {pending ? "Logging…" : "Log application"}
      </button>
      {state.error ? (
        <p className="text-xs text-[#e24756]" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
