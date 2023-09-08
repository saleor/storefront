import Link from "next/link";

function EmptyCart({ paths }: any) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="mb-4 font-bold text-5xl md:text-6xl xl:text-7xl tracking-tight max-w-[647px] md:max-w-full">
        Twój koszyk jest pusty
      </h1>
      <p className="text-[1.8rem]">Może jeszcze nie dokonałeś wyboru</p>
      <div className="mt-8">
        <Link
          href={paths.$url()}
          className="text-2xl md:text-3xl border-brand border-2 bg-brand hover:border-brand hover:bg-white hover:text-brand transition
               text-white font-bold py-4 px-8 rounded-full"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  );
}

export default EmptyCart;
