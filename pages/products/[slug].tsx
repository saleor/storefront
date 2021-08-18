import { request, gql } from 'graphql-request';

import { Navbar } from '../../components/Navbar';
import { useProductByIdQuery } from '../../generated/graphql';

import { Products } from '../../components/config'

export default function ProductPage({ product }) {
  const { loading, error, data } = useProductByIdQuery({
    variables: product
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const { product } = data;

    const description = product?.description ? JSON.parse(product?.description).blocks[0].data.text : '';

    const price = product?.pricing?.priceRange?.start?.gross.amount || 0;

    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="max-w-7xl mx-auto pt-8 px-8">
          <div className="grid grid-cols-2 gap-x-10 items-start">
            <div className="w-full aspect-w-1 aspect-h-1 bg-white rounded">
              <img
                src={product?.media[0]?.url}
                className="w-full h-full object-center object-cover"
              />
            </div>

            <div className="space-y-8">
              <h1 className="text-4xl font-bold tracking-tight text-gray-800">{product?.name}</h1>

              <p className="text-2xl text-gray-900">{new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'USD'
              }).format(price)}</p>

              <div
                className="text-base text-gray-700 space-y-6"
                dangerouslySetInnerHTML={{ __html: description }}
              />

              <button
                type="submit"
                className="max-w-xs w-full bg-blue-500 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none"
              >
                Add to cart
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return null;
}

const fetcher = (query: string) => request('https://vercel.saleor.cloud/graphql/', query)

export async function getStaticPaths() {
  const { products: { edges } } = await fetcher(gql`${Products}`);

  const paths = edges.map(({ node }) => ({ params: { slug: node.id } }));

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const product = { id: params.slug };

  return {
    props: {
      product
    }
  }
}
