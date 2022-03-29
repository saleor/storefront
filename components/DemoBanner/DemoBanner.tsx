export function DemoBanner() {
  return (
    <div className="flex flex-row-reverse items-center h-16 space-x-4 border-b-2 border-dashed">
      <div className="px-4">
        <a href="https://demo.saleor.io/graphql/">
          <span className="hidden md:inline text-gray-600">Play with&nbsp;</span>
          <span className="uppercase font-semibold">GraphQL API</span>
        </a>
      </div>
      <div className="border-r mx-4">&nbsp;</div>
      <div>
        <a href="https://demo.saleor.io/dashboard/">
          <span className="hidden md:inline text-gray-600">Explore&nbsp;</span>
          <span className="uppercase font-semibold">store&apos;s dashboard</span>
        </a>
      </div>
    </div>
  );
}

export default DemoBanner;
