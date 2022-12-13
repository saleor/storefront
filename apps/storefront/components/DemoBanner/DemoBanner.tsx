export function DemoBanner() {
  return (
    <div className="flex flex-row items-center h-16 space-x-4 border-b-2 border-dashed text-md">
      <div className="justify-self-start px-4 mr-auto">
        <a href="https://github.com/saleor/saleor/">
          <span className="hidden md:inline text-gray-600">⭐️ Star us on&nbsp;</span>
          <span className="uppercase font-semibold">Github</span>
        </a>
      </div>

      <div>
        <a href="https://demo.saleor.io/dashboard/">
          <span className="hidden md:inline text-gray-600">Explore&nbsp;</span>
          <span className="uppercase font-semibold">store&apos;s dashboard</span>
        </a>
      </div>

      <div className="border-r mx-4">&nbsp;</div>

      <div className="px-4">
        <a href="https://demo.saleor.io/graphql/">
          <span className="hidden md:inline text-gray-600">Play with&nbsp;</span>
          <span className="uppercase font-semibold">GraphQL API</span>
        </a>
      </div>
    </div>
  );
}

export default DemoBanner;
