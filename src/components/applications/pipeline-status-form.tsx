import { updateApplicationStatusAction } from "@/app/actions/applications";
import {
  type PipelineStatus,
  pipelineStatuses,
  pipelineStatusLabels,
} from "@/lib/applications/pipeline";

/**
 * Moves an Application along the Pipeline. A plain form (no client
 * JavaScript): pick a status, press Move. Each move updates the row, and the
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
      <select
        aria-label="Pipeline status"
        className="h-8 rounded border border-white/15 bg-[#141513] px-2 text-[12px] text-[#e7e7df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2c2ba]"
        defaultValue={status}
        name="status"
      >
        {pipelineStatuses.map((value) => (
          <option key={value} value={value}>
            {pipelineStatusLabels[value]}
          </option>
        ))}
      </select>
      <button
        className="h-8 rounded border border-white/15 bg-white/[0.03] px-3 text-[12px] text-[#e7e7df] transition-colors hover:border-white/40 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2c2ba]"
        type="submit"
      >
        Move
      </button>
    </form>
  );
}
