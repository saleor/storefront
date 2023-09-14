import Link from "next/link";
import React from "react";

function EmptyCart({ paths }: any) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bold text-5xl md:text-6xl xl:text-6xl tracking-tight max-w-[647px] md:max-w-full">
        Twój koszyk jest pusty
      </h1>
      <p className="text-[1.8rem] text-gray-500">
        Nie dodałeś nic do swojego koszyka. <br /> Jesteśmy pewni, że znajdziesz coś ciekawego!
      </p>
      <div className="mt-4">
        <Link
          href={paths.$url()}
          className="text-2xl md:text-3xl border-black border-2 bg-transparent hover:border-black hover:bg-black hover:text-white transition
               text-black font-bold py-4 px-8 rounded-full text-center"
        >
          Kontynuuj zakupy
        </Link>
      </div>
    </div>
  );
}

export default EmptyCart;
