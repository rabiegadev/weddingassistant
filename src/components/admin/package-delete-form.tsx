"use client";

import { useFormState, useFormStatus } from "react-dom";
import { deletePackageAction, type PkgState } from "@/app/actions/packages";

const delInit: PkgState = undefined;

function DelBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="text-xs text-rose-300/90 underline disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "…" : "Usuń (gdy brak powiązań z zamówieniami)"}
    </button>
  );
}

export function PackageDeleteForm({ id }: { id: string }) {
  const [st, formAction] = useFormState(deletePackageAction, delInit);
  return (
    <form action={formAction} className="pt-2">
      <input type="hidden" name="id" value={id} readOnly />
      {st && "error" in st && st.error ? <p className="text-xs text-rose-300">{st.error}</p> : null}
      <DelBtn />
    </form>
  );
}
