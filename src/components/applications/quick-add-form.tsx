"use client";

import { format } from "date-fns";
import { CalendarIcon, LoaderCircleIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import {
  createApplicationAction,
  type QuickAddApplicationState,
} from "@/app/actions/applications";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  pipelineStatuses,
  pipelineStatusLabels,
} from "@/lib/applications/pipeline";

const initialState: QuickAddApplicationState = {};

export function QuickAddApplicationForm() {
  const [state, action, pending] = useActionState(
    createApplicationAction,
    initialState,
  );
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // A successful log resets the form; React clears the uncontrolled inputs,
  // and the deadline (controlled) is cleared here to match.
  useEffect(() => {
    if (state.ok) {
      setDeadline(undefined);
    }
  }, [state]);

  return (
    <form action={action} className="mt-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="application-company">Company</Label>
        <Input
          autoComplete="off"
          disabled={pending}
          id="application-company"
          name="company"
          placeholder="Linear"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="application-role">Role</Label>
        <Input
          autoComplete="off"
          disabled={pending}
          id="application-role"
          name="role"
          placeholder="Product engineer"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="application-url">Posting URL (optional)</Label>
        <Input
          autoComplete="off"
          disabled={pending}
          id="application-url"
          name="url"
          placeholder="https://…"
          type="url"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="application-status">Pipeline status</Label>
          <Select defaultValue="saved" disabled={pending} name="status">
            <SelectTrigger className="w-full" id="application-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pipelineStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {pipelineStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="application-deadline">Deadline (optional)</Label>
          <Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
            <PopoverTrigger
              aria-label={
                deadline
                  ? `Deadline: ${format(deadline, "MMM d, yyyy")}`
                  : "Choose a deadline"
              }
              asChild
            >
              <Button
                className="border-input bg-input/30 justify-between font-normal hover:bg-input/50 aria-expanded:bg-input/50 dark:bg-input/30 dark:hover:bg-input/50"
                disabled={pending}
                id="application-deadline"
                variant="outline"
              >
                {deadline ? (
                  format(deadline, "MMM d, yyyy")
                ) : (
                  <span className="text-muted-foreground">Pick a date</span>
                )}
                <CalendarIcon
                  aria-hidden="true"
                  className="text-muted-foreground"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                onSelect={(selected) => {
                  setDeadline(selected);
                  setCalendarOpen(false);
                }}
                selected={deadline}
                weekStartsOn={1}
              />
            </PopoverContent>
          </Popover>
          <input
            name="deadline"
            type="hidden"
            value={deadline ? format(deadline, "yyyy-MM-dd") : ""}
          />
        </div>
      </div>
      <Button className="mt-1" disabled={pending} type="submit">
        {pending ? (
          <>
            <LoaderCircleIcon
              aria-hidden="true"
              className="animate-spin"
              data-icon="inline-start"
            />
            Logging…
          </>
        ) : (
          "Log application"
        )}
      </Button>
      {state.error ? (
        <p className="text-xs text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
