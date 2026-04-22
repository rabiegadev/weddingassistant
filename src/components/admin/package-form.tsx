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
      className="rounded-md bg-[#B8955C] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Zapis…" : "Zapisz"}
    </button>
  );
}

export function PackageForm({ action, initial: init }: Props) {
  const [state, formAction] = useFormState(action, initial);
  return (
    <div className="space-y-2 text-left text-sm text-slate-800">
      <form action={formAction} className="space-y-2">
        {init?.id ? <input name="id" type="hidden" value={init.id} /> : null}
        <div>
          <label className="block text-xs font-medium text-slate-600" htmlFor="n">
            Nazwa
          </label>
          <input
            className="mt-0.5 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-900 shadow-sm"
            id="n"
            name="name"
            defaultValue={init?.name ?? ""}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600" htmlFor="s">
            Slug (puste = z nazwy)
          </label>
          <input
            className="mt-0.5 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-900 shadow-sm"
            id="s"
            name="slug"
            defaultValue={init?.slug ?? ""}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600" htmlFor="d">
            Opis
          </label>
          <textarea
            className="mt-0.5 min-h-20 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-900 shadow-sm"
            id="d"
            name="description"
            defaultValue={init?.description ?? ""}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600" htmlFor="p">
            Cena (grosze, np. 49900 = 499,00 zł)
          </label>
          <input
            className="mt-0.5 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-900 shadow-sm"
            id="p"
            name="priceCents"
            type="number"
            min={0}
            defaultValue={init?.priceCents ?? 0}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600" htmlFor="f">
            Cechy (JSON, np. {`{"weddingPage":true,"rsvp":true}`})
          </label>
          <textarea
            className="mt-0.5 min-h-16 w-full rounded border border-slate-300 bg-white px-2 py-1.5 font-mono text-xs text-slate-900 shadow-sm"
            id="f"
            name="features"
            defaultValue={init?.features ?? "{}"}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600" htmlFor="o">
            Kolejność
          </label>
          <input
            className="mt-0.5 w-20 rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-900 shadow-sm"
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
          <span className="text-xs text-slate-700">Opublikuj na cenniku</span>
        </div>
        {state && "error" in state && state.error ? <p className="text-rose-600">{state.error}</p> : null}
        {state && "ok" in state && state.ok ? <p className="text-emerald-700">Zapisano.</p> : null}
        <Submit />
      </form>
      {init?.id ? <PackageDeleteForm id={init.id} /> : null}
    </div>
  );
}
