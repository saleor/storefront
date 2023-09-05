import { ProductListByCategoryDocument } from '@/gql/graphql';
import { execute } from "@/lib";
import { ProductElement } from '@/ui/components/ProductElement';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'My Page Title',
};

export default async function Page({ params }: { params: { id: string } }) {
  const { category } = await execute(ProductListByCategoryDocument, {
    variables: { slug: params.id },
    cache: 'no-store'
  })

  if (!category) {
    notFound();
  }

  const { name, products } = category;

  return (
    <div>
      <div className="bg-slate-100/50 border-b">
        <div className="max-w-7xl mx-auto p-8">
          <h2 className="text-xl font-semibold">{name}</h2>
        </div>
      </div>
      <section className="mx-auto max-w-2xl px-8 py-12 sm:px-6 sm:py-18 lg:max-w-7xl">
        <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products?.edges.map(({ node: product }) =>
            <ProductElement key={product.id} {...product} />
          )}
        </div>
      </section>
    </div>
  )
}