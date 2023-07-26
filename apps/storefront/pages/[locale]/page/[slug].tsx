import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import { ReactElement } from "react";

import { Layout, RichText } from "@/components";
import { contextToRegionQuery } from "@/lib/regions";
import { translate } from "@/lib/translations";
import { PageDocument, PageQuery, PageQueryVariables } from "@/saleor/api";
import { serverApolloClient } from "@/lib/ssr/common";
import Image from "next/image";
import { AWS_MEDIA_BUCKET } from "@/lib/const";

export interface pathParams {
  channel: string;
  locale: string;
  slug: string;
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = async (
  context: GetStaticPropsContext<{ channel: string; locale: string; slug: string }>
) => {
  if (!context.params) {
    return {
      props: {},
      notFound: true,
    };
  }

  const pageSlug = context.params.slug.toString();
  const response: ApolloQueryResult<PageQuery> = await serverApolloClient.query<
    PageQuery,
    PageQueryVariables
  >({
    query: PageDocument,
    variables: {
      slug: pageSlug,
      locale: contextToRegionQuery(context).locale,
    },
  });
  return {
    props: {
      page: response.data.page,
    },
  };
};
function PagePage({ page }: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!page?.id) {
    return <Custom404 />;
  }

  const content = translate(page, "content");

  return (
    <main className="container pt-8 px-8">
      {page?.attributes.slice(0, 1).map(({ attribute, values }, attributeIndex) => (
        <div key={attribute.id} data-test-id={attributeIndex}>
          {values.map((value) => {
            const url = value?.file?.url.split("/");
            const correctedUrl = `${AWS_MEDIA_BUCKET}/${url[url.length - 2]}/${
              url[url.length - 1]
            }`;
            return (
              <Image src={correctedUrl} alt="attributes" key={value.id} width="400" height="400" />
            );
          })}
        </div>
      ))}

      <div className="mt-32">{content && <RichText jsonStringData={content} />}</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-64">
        {page?.attributes.slice(1, 3).map(({ attribute, values }, attributeIndex) => (
          <div key={attribute.id} data-test-id={attributeIndex}>
            {values.map((value) => {
              const url = value?.file?.url.split("/");
              const correctedUrl = `${AWS_MEDIA_BUCKET}/${url[url.length - 2]}/${
                url[url.length - 1]
              }`;
              return (
                <div key={value.id} className="flex items-center justify-center">
                  <Image
                    src={correctedUrl}
                    alt="attributes"
                    key={value.id}
                    className="w-full h-auto"
                    width={400}
                    height={500}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}

export default PagePage;

PagePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
