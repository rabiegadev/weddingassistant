const heroPrepItems = [
  "wypisywanie zaproszeń",
  "rozdawanie zaproszeń",
  "rozmieszczanie gości przy stolikach",
  "dopinanie umów z usługodawcami",
  "wybieranie dekoracji",
  "spotkania z wykonawcami i tak dalej",
] as const;

export default function NaszaHistoriaPage() {
  return (
    <main className="bg-[#f9f6f0]">
      <section className="scroll-mt-wa border-b border-t border-[#e8e2dc]/70" aria-labelledby="sekcja-historia">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 pb-20 sm:px-6 sm:py-16 sm:pb-24">
          <h1
            className="font-wa-display text-balance text-2xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-3xl"
            id="sekcja-historia"
          >
            Nasza historia
          </h1>
          <div className="mt-6 space-y-5 text-[0.875rem] leading-[1.72] text-[#4F4A45] sm:text-[0.94rem]">
            <p className="text-pretty font-medium text-[#3d3834]">Weddingassistant — Twoje wsparcie przedweselne online</p>
            <p className="text-pretty">
              Dziękujemy za wizytę na naszej stronie — a skoro już tutaj się widzimy… to najpewniej planujecie wielkimi
              krokami ten piękny i wyczekiwany dzień!
            </p>
            <p className="text-pretty">Tak się składa, że wraz z moją jeszcze wtedy narzeczoną byliśmy rok temu w tym samym miejscu:</p>
            <ul
              className="list-none space-y-1.5 border-l-2 border-[#B8955C]/30 py-0.5 pl-4 text-[0.84rem] text-[#5A534C] sm:text-[0.9rem]"
              aria-label="Przykładowe zadania przed ślubem"
            >
              {heroPrepItems.map((line) => (
                <li key={line} className="flex gap-2.5 text-pretty">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#B8955C]/55" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-pretty">
              Było tego tak dużo, że zdarzało się o czymś zapomnieć, spóźnić się, na ostatnią chwilę zamawiać i tracić bardzo
              dużo czasu. Sprawdzałem różne aplikacje oraz serwisy, żeby wygenerować sobie checklisty, zrobić nieco bardziej
              rozbudowany spis gości czy rozłożyć gości przy stołach — ale wszystko kończyło się brakiem możliwości
              dopasowania do naszych wymagań.
            </p>
            <p className="text-pretty">
              W związku z nieubłaganie pędzącym czasem postanowiłem wykorzystać swoje zainteresowania i doświadczenie, żeby
              przygotować różnego rodzaju „helpery” weselne na własny użytek. Własny użytek zmienił się w przesyłanie
              aplikacji znajomym i naturalną siłą rzeczy pojawił się pomysł na udostępnienie tych narzędzi online szerszej
              grupie odbiorców.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
