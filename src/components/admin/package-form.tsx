"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { savePackageAction } from "@/app/actions/packages";
import { PackageDeleteForm } from "@/components/admin/package-delete-form";
import type { PkgState } from "@/app/actions/packages";

const initial: PkgState = {};

type Pkg = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  features: string;
  sortOrder: number;
  isPublished: boolean;
};

type Props = {
  action: typeof savePackageAction;
  initial: Pkg | null;
};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded-md bg-amber-600/90 px-4 py-2 text-sm text-zinc-950 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Zapis…" : "Zapisz"}
    </button>
  );
}

export function PackageForm({ action, initial: init }: Props) {
  const [state, formAction] = useFormState(action, initial);
  return (
    <div className="space-y-2 text-left text-sm text-zinc-200">
      <form action={formAction} className="space-y-2">
        {init?.id ? <input name="id" type="hidden" value={init.id} /> : null}
        <div>
          <label className="block text-xs text-zinc-500" htmlFor="n">
            Nazwa
          </label>
          <input
            className="mt-0.5 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5"
            id="n"
            name="name"
            defaultValue={init?.name ?? ""}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500" htmlFor="s">
            Slug (puste = z nazwy)
          </label>
          <input
            className="mt-0.5 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5"
            id="s"
            name="slug"
            defaultValue={init?.slug ?? ""}
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500" htmlFor="d">
            Opis
          </label>
          <textarea
            className="mt-0.5 min-h-20 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5"
            id="d"
            name="description"
            defaultValue={init?.description ?? ""}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500" htmlFor="p">
            Cena (grosze, np. 49900 = 499,00 zł)
          </label>
          <input
            className="mt-0.5 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5"
            id="p"
            name="priceCents"
            type="number"
            min={0}
            defaultValue={init?.priceCents ?? 0}
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500" htmlFor="f">
            Cechy (JSON, np. {`{"weddingPage":true,"rsvp":true}`})
          </label>
          <textarea
            className="mt-0.5 min-h-16 w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 font-mono text-xs"
            id="f"
            name="features"
            defaultValue={init?.features ?? "{}"}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500" htmlFor="o">
            Kolejność
          </label>
          <input
            className="mt-0.5 w-20 rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5"
            id="o"
            name="sortOrder"
            type="number"
            defaultValue={init?.sortOrder ?? 0}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            name="isPublished"
            type="checkbox"
            defaultChecked={init?.isPublished ?? true}
            className="h-4 w-4"
          />
          <span className="text-xs">Opublikuj na cenniku</span>
        </div>
        {state && "error" in state && state.error ? <p className="text-rose-300">{state.error}</p> : null}
        {state && "ok" in state && state.ok ? <p className="text-emerald-300">Zapisano.</p> : null}
        <Submit />
      </form>
      {init?.id ? <PackageDeleteForm id={init.id} /> : null}
    </div>
  );
}
