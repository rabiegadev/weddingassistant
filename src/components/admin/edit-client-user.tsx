"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Package, UserSubscription } from "@prisma/client";
import {
  adminUpdateUserAction,
  adminUpdateClientProfileAction,
  type AdminUserActionState,
} from "@/app/actions/admin-users";
import {
  adminCreateSubscriptionAction,
  adminUpdateSubscriptionEndsAction,
  adminDeleteSubscriptionAction,
  type AdminSubActionState,
} from "@/app/actions/admin-subscriptions";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

const init: AdminUserActionState = undefined;
const initSub: AdminSubActionState = undefined;

function toLocalDatetimeValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditClientIdentityForm({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name: string | null;
}) {
  const [st, action] = useActionState(adminUpdateUserAction, init);
  return (
    <form action={action} className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Konto</h3>
      <input type="hidden" name="userId" value={userId} readOnly />
      <div>
        <label className="text-xs font-medium text-slate-600">E-mail</label>
        <input
          name="email"
          type="email"
          required
          defaultValue={email}
          className="mt-0.5 block w-full max-w-md rounded border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Wyświetlane imię</label>
        <input
          name="name"
          type="text"
          defaultValue={name ?? ""}
          className="mt-0.5 block w-full max-w-md rounded border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      {st && "error" in st && st.error ? <p className="text-xs text-rose-600">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-xs text-emerald-700">Zapisano.</p> : null}
      <Submit label="Zapisz konto" />
    </form>
  );
}

export function EditClientProfileForm({
  userId,
  weddingDate,
  infoJson,
}: {
  userId: string;
  weddingDate: Date | null;
  infoJson: string | null;
}) {
  const [st, action] = useActionState(adminUpdateClientProfileAction, init);
  const wd = weddingDate ? weddingDate.toISOString().slice(0, 10) : "";
  return (
    <form action={action} className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Profil pary / baza informacji</h3>
      <input type="hidden" name="userId" value={userId} readOnly />
      <div>
        <label className="text-xs font-medium text-slate-600">Data ślubu</label>
        <input
          name="weddingDate"
          type="date"
          defaultValue={wd}
          className="mt-0.5 block rounded border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">infoJson (strukturalna baza — JSON)</label>
        <textarea
          name="infoJson"
          rows={8}
          defaultValue={infoJson ?? ""}
          placeholder='np. {"venues":{"ceremony":"..."}}'
          className="mt-0.5 w-full max-w-3xl rounded border border-slate-300 px-2 py-1.5 font-mono text-xs"
        />
      </div>
      {st && "error" in st && st.error ? <p className="text-xs text-rose-600">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-xs text-emerald-700">Zapisano.</p> : null}
      <Submit label="Zapisz profil" />
    </form>
  );
}

export function CreateSubscriptionForm({
  userId,
  packages,
}: {
  userId: string;
  packages: Package[];
}) {
  const [st, action] = useActionState(adminCreateSubscriptionAction, initSub);
  const defaultEnds = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  return (
    <form action={action} className="space-y-2 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4">
      <h3 className="text-sm font-semibold text-emerald-950">Nowy dostęp / plan (ręcznie)</h3>
      <input type="hidden" name="userId" value={userId} readOnly />
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-xs font-medium text-slate-600">Pakiet</label>
          <select
            name="packageId"
            required
            className="mt-0.5 block rounded border border-slate-300 bg-white px-2 py-1.5 text-sm"
          >
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Koniec dostępu</label>
          <input
            name="endsAt"
            type="datetime-local"
            required
            defaultValue={toLocalDatetimeValue(defaultEnds)}
            className="mt-0.5 block rounded border border-slate-300 bg-white px-2 py-1.5 text-sm"
          />
        </div>
      </div>
      {st && "error" in st && st.error ? <p className="text-xs text-rose-600">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-xs text-emerald-700">Dodano subskrypcję.</p> : null}
      <Submit label="Utwórz wpis" />
    </form>
  );
}

export function SubscriptionRowEditor({
  sub,
}: {
  sub: UserSubscription & { package: Package };
}) {
  const [stUpd, updateAction] = useActionState(adminUpdateSubscriptionEndsAction, initSub);
  const [stDel, deleteAction] = useActionState(adminDeleteSubscriptionAction, initSub);
  return (
    <li className="rounded-lg border border-slate-200 bg-white px-3 py-3">
      <p className="text-sm font-medium text-slate-900">{sub.package.name}</p>
      <p className="text-xs text-slate-500">ID: {sub.id}</p>
      <form action={updateAction} className="mt-2 flex flex-wrap items-end gap-2">
        <input type="hidden" name="subscriptionId" value={sub.id} readOnly />
        <div>
          <label className="text-xs text-slate-600">Koniec dostępu</label>
          <input
            name="endsAt"
            type="datetime-local"
            required
            defaultValue={toLocalDatetimeValue(sub.endsAt)}
            className="mt-0.5 block rounded border border-slate-300 px-2 py-1 text-sm"
          />
        </div>
        <Submit label="Aktualizuj datę" />
        {stUpd && "error" in stUpd && stUpd.error ? (
          <span className="text-xs text-rose-600">{stUpd.error}</span>
        ) : null}
        {stUpd && "ok" in stUpd && stUpd.ok ? (
          <span className="text-xs text-emerald-700">Zapisano.</span>
        ) : null}
      </form>
      <form action={deleteAction} className="mt-2">
        <input type="hidden" name="subscriptionId" value={sub.id} readOnly />
        <button
          type="submit"
          className="text-xs font-medium text-rose-700 underline hover:text-rose-900"
        >
          Usuń wpis (ostrożnie)
        </button>
        {stDel && "error" in stDel && stDel.error ? (
          <span className="ml-2 text-xs text-rose-600">{stDel.error}</span>
        ) : null}
      </form>
    </li>
  );
}
