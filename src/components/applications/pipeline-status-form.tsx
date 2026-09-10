"use client";

import { updateApplicationStatusAction } from "@/app/actions/applications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  type PipelineStatus,
  pipelineStatuses,
  pipelineStatusLabels,
} from "@/lib/applications/pipeline";

/**
 * Moves an Application along the Pipeline. Each move updates the row, and the
 * update timestamp is what earns that day its Hit.
 */
export function PipelineStatusForm({
  applicationId,
  status,
}: {
  applicationId: string;
  status: PipelineStatus;
}) {
  return (
    <form
      action={updateApplicationStatusAction}
      className="flex items-center gap-2"
    >
      <input name="id" type="hidden" value={applicationId} />
      <Select defaultValue={status} name="status">
        <SelectTrigger aria-label="Pipeline status" className="w-32" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pipelineStatuses.map((value) => (
            <SelectItem key={value} value={value}>
              {pipelineStatusLabels[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <SubmitButton pendingLabel="Moving…" size="sm" variant="outline">
        Move
      </SubmitButton>
    </form>
  );
}
