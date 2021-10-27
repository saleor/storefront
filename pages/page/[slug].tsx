import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

import { BaseTemplate, RichText } from "@/components";
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

  if (loading) return <BaseTemplate isLoading={true} />;
  if (error) return <p>Error</p>;

  const page = data?.page;
  if (!page?.id) {
    return null;
  }

  return (
    <BaseTemplate>
      <main className="max-w-7xl mx-auto pt-8 px-8">
        {!!page.content && <RichText jsonStringData={page.content} />}
      </main>
    </BaseTemplate>
  );
};

export default PagePage;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
