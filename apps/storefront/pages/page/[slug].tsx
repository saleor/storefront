import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { ReactElement } from "react";

import { Layout, RichText, Spinner } from "@/components";
import { usePageQuery } from "@/saleor/api";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      pageSlug: context.params?.slug?.toString(),
    },
  };
};

const PagePage = ({
  pageSlug,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { loading, error, data } = usePageQuery({
    variables: { slug: pageSlug || "" },
    skip: !pageSlug,
  });

  if (loading) return <Spinner />;
  if (error) return <p>Error</p>;

  const page = data?.page;
  if (!page?.id) {
    return null;
  }

  return (
    <main className="max-w-7xl mx-auto pt-8 px-8">
      {!!page.content && <RichText jsonStringData={page.content} />}
    </main>
  );
};

export default PagePage;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

PagePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
