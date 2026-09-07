"use client";

import { deleteAccountAction } from "@/app/actions/auth";

export function DeleteAccountButton() {
  return (
    <form
      action={deleteAccountAction}
      onSubmit={(event) => {
        if (
          !confirm(
            "Delete your account and all of your grind? This is permanent and cannot be undone.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded border border-[#e24756]/40 px-4 py-2 text-[13px] text-[#e24756] transition-colors hover:bg-[#e24756]/10"
      >
        Delete my account and all data
      </button>
    </form>
  );
}
