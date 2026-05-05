"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import type { BasicInfoRecord } from "@/lib/client-profile/basic-info";
import { saveBasicInfoAction, type BasicInfoActionState } from "@/app/actions/client-profile";

type Props = {
  initialData: BasicInfoRecord;
  hasSavedData: boolean;
};

const init: BasicInfoActionState = undefined;

function Field({
  label,
  name,
  defaultValue,
  disabled,
  type = "text",
  required = false,
}: {
  label: string;
  name: keyof BasicInfoRecord;
  defaultValue: string;
  disabled: boolean;
  type?: "text" | "date" | "time" | "email" | "tel" | "number" | "url";
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 disabled:bg-slate-100 disabled:text-slate-600"
      />
    </label>
  );
}

export function BasicInfoForm({ initialData, hasSavedData }: Props) {
  const [state, action, pending] = useActionState(saveBasicInfoAction, init);
  const [editing, setEditing] = useState(!hasSavedData);
  const [weddingType, setWeddingType] = useState<BasicInfoRecord["weddingType"]>(initialData.weddingType);
  const [ceremonyPlace, setCeremonyPlace] = useState<BasicInfoRecord["ceremonyPlace"]>(initialData.ceremonyPlace);
  const [lodging, setLodging] = useState<BasicInfoRecord["lodging"]>(initialData.lodging);
  const [transport, setTransport] = useState<BasicInfoRecord["transport"]>(initialData.transport);

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      setEditing(false);
    }
  }, [state]);

  const typeHint = useMemo(
    () =>
      weddingType === "CYWILNY"
        ? "Ślub cywilny zawierany jest przed urzędnikiem stanu cywilnego."
        : "Ślub konkordatowy to ceremonia kościelna mająca jednocześnie skutki cywilnoprawne.",
    [weddingType]
  );

  const disabled = pending || !editing;
  return (
    <form action={action} className="space-y-5 rounded-xl border border-[var(--wa-dash-border)] bg-white p-4 sm:p-5">
      <header>
        <h2 className="text-base font-semibold text-[var(--wa-dash-navy)]">Informacje podstawowe</h2>
        <p className="mt-1 text-sm text-[var(--wa-dash-muted)]">
          Wypełnij dane raz, zapisz i wracaj do edycji przez przycisk „Edytuj informacje”.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Data ślubu" name="weddingDate" type="date" defaultValue={initialData.weddingDate} disabled={disabled} required />
        <Field label="Imię panny młodej" name="brideFirstName" defaultValue={initialData.brideFirstName} disabled={disabled} required />
        <Field label="Nazwisko panny młodej" name="brideLastName" defaultValue={initialData.brideLastName} disabled={disabled} required />
        <Field label="Imię pana młodego" name="groomFirstName" defaultValue={initialData.groomFirstName} disabled={disabled} required />
        <Field label="Nazwisko pana młodego" name="groomLastName" defaultValue={initialData.groomLastName} disabled={disabled} required />
        <Field label="Imię świadka 1" name="witness1FirstName" defaultValue={initialData.witness1FirstName} disabled={disabled} required />
        <Field label="Nazwisko świadka 1" name="witness1LastName" defaultValue={initialData.witness1LastName} disabled={disabled} required />
        <Field label="Imię świadka 2" name="witness2FirstName" defaultValue={initialData.witness2FirstName} disabled={disabled} required />
        <Field label="Nazwisko świadka 2" name="witness2LastName" defaultValue={initialData.witness2LastName} disabled={disabled} required />
      </div>

      <section className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Wybór ślubu</span>
            <select
              name="weddingType"
              defaultValue={initialData.weddingType}
              onChange={(e) => {
                const next = e.currentTarget.value as BasicInfoRecord["weddingType"];
                setWeddingType(next);
                if (next === "CYWILNY" && ceremonyPlace === "KOSCIOL") {
                  setCeremonyPlace("USC");
                }
                if (next === "KONKORDATOWY" && ceremonyPlace === "USC") {
                  setCeremonyPlace("KOSCIOL");
                }
              }}
              disabled={disabled}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
            >
              <option value="CYWILNY">Cywilny</option>
              <option value="KONKORDATOWY">Konkordatowy</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Miejsce ślubu</span>
            <select
              name="ceremonyPlace"
              defaultValue={initialData.ceremonyPlace}
              onChange={(e) => setCeremonyPlace(e.currentTarget.value as BasicInfoRecord["ceremonyPlace"])}
              disabled={disabled}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
            >
              <option value="PLENER">Plener</option>
              {weddingType === "CYWILNY" ? <option value="USC">Urząd Stanu Cywilnego</option> : null}
              {weddingType === "KONKORDATOWY" ? <option value="KOSCIOL">Kościół</option> : null}
            </select>
          </label>
        </div>
        <p className="text-xs text-slate-600">{typeHint}</p>

        {ceremonyPlace === "PLENER" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Pinezka mapy (link)" name="ceremonyMapPin" type="url" defaultValue={initialData.ceremonyMapPin} disabled={disabled} required />
            <Field label="Adres ślubu" name="ceremonyAddress" defaultValue={initialData.ceremonyAddress} disabled={disabled} required />
            <Field label="Opis miejsca" name="ceremonyDescription" defaultValue={initialData.ceremonyDescription} disabled={disabled} />
          </div>
        ) : null}
        {ceremonyPlace === "USC" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nazwa USC" name="uscName" defaultValue={initialData.uscName} disabled={disabled} required />
            <Field label="Adres USC" name="uscAddress" defaultValue={initialData.uscAddress} disabled={disabled} required />
            <Field label="Opis USC" name="uscDescription" defaultValue={initialData.uscDescription} disabled={disabled} />
          </div>
        ) : null}
        {ceremonyPlace === "KOSCIOL" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nazwa kościoła" name="churchName" defaultValue={initialData.churchName} disabled={disabled} required />
            <Field label="Adres kościoła" name="churchAddress" defaultValue={initialData.churchAddress} disabled={disabled} required />
            <Field label="Opis kościoła" name="churchDescription" defaultValue={initialData.churchDescription} disabled={disabled} />
          </div>
        ) : null}
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Godzina ślubu" name="ceremonyTime" type="time" defaultValue={initialData.ceremonyTime} disabled={disabled} required />
        <Field label="Godzina wesela" name="weddingPartyTime" type="time" defaultValue={initialData.weddingPartyTime} disabled={disabled} required />
        <Field label="Szacowana liczba gości" name="estimatedGuests" type="number" defaultValue={initialData.estimatedGuests} disabled={disabled} required />
        <Field label="Nazwa lokalizacji wesela" name="weddingVenueName" defaultValue={initialData.weddingVenueName} disabled={disabled} required />
        <Field label="Adres lokalizacji wesela" name="weddingVenueAddress" defaultValue={initialData.weddingVenueAddress} disabled={disabled} required />
        <Field label="Opis lokalizacji wesela" name="weddingVenueDescription" defaultValue={initialData.weddingVenueDescription} disabled={disabled} />
      </div>

      <section className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Kontakty</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Telefon panny młodej" name="bridePhone" type="tel" defaultValue={initialData.bridePhone} disabled={disabled} required />
          <Field label="Telefon pana młodego" name="groomPhone" type="tel" defaultValue={initialData.groomPhone} disabled={disabled} required />
          <Field label="Telefon świadka 1" name="witness1Phone" type="tel" defaultValue={initialData.witness1Phone} disabled={disabled} />
          <Field label="Telefon świadka 2" name="witness2Phone" type="tel" defaultValue={initialData.witness2Phone} disabled={disabled} />
          <Field label="E-mail panny młodej" name="brideEmail" type="email" defaultValue={initialData.brideEmail} disabled={disabled} required />
          <Field label="E-mail pana młodego" name="groomEmail" type="email" defaultValue={initialData.groomEmail} disabled={disabled} required />
          <Field label="E-mail świadka 1" name="witness1Email" type="email" defaultValue={initialData.witness1Email} disabled={disabled} />
          <Field label="E-mail świadka 2" name="witness2Email" type="email" defaultValue={initialData.witness2Email} disabled={disabled} />
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Nocleg</h3>
        <label className="block max-w-xs">
          <span className="text-xs font-medium text-slate-600">Nocleg</span>
          <select
            name="lodging"
            defaultValue={initialData.lodging}
            onChange={(e) => setLodging(e.currentTarget.value as BasicInfoRecord["lodging"])}
            disabled={disabled}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
          >
            <option value="NIE">Nie</option>
            <option value="TAK">Tak</option>
          </select>
        </label>
        {lodging === "TAK" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Gdzie nocleg?" name="lodgingWhere" defaultValue={initialData.lodgingWhere} disabled={disabled} required />
            <Field label="Dla kogo nocleg?" name="lodgingForWhom" defaultValue={initialData.lodgingForWhom} disabled={disabled} required />
            <Field label="Kto opłaca nocleg?" name="lodgingWhoPays" defaultValue={initialData.lodgingWhoPays} disabled={disabled} required />
            <Field label="Dodatkowe informacje o noclegu" name="lodgingInfo" defaultValue={initialData.lodgingInfo} disabled={disabled} />
          </div>
        ) : null}
      </section>

      <section className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Transport</h3>
        <label className="block max-w-xs">
          <span className="text-xs font-medium text-slate-600">Transport</span>
          <select
            name="transport"
            defaultValue={initialData.transport}
            onChange={(e) => setTransport(e.currentTarget.value as BasicInfoRecord["transport"])}
            disabled={disabled}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
          >
            <option value="NIE">Nie</option>
            <option value="TAK">Tak</option>
          </select>
        </label>
        {transport === "TAK" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Rodzaj transportu" name="transportType" defaultValue={initialData.transportType} disabled={disabled} required />
            <Field label="Dla kogo transport?" name="transportForWhom" defaultValue={initialData.transportForWhom} disabled={disabled} required />
            <Field label="Godziny transportu" name="transportHours" defaultValue={initialData.transportHours} disabled={disabled} required />
            <Field label="Dodatkowe informacje o transporcie" name="transportInfo" defaultValue={initialData.transportInfo} disabled={disabled} />
          </div>
        ) : null}
      </section>

      {state && "error" in state && state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
      {state && "ok" in state && state.ok ? (
        <p className="text-sm text-emerald-700">Informacje zapisane. Możesz je ponownie odblokować przyciskiem „Edytuj informacje”.</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={pending || !editing}
          className="rounded-md bg-[var(--wa-dash-navy)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Zapisywanie..." : "Zapisz informacje"}
        </button>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800"
          >
            Edytuj informacje
          </button>
        ) : null}
      </div>
    </form>
  );
}
