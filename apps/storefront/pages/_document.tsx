import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document<{ lang?: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps, lang: ctx?.query?.locale };
  }

  render() {
    const uri = process.env.NEXT_PUBLIC_API_URI!;
    const { hostname } = new URL(uri);

    return (
      <Html lang={this.props.lang}>
        <Head>
          <link rel="preconnect" href={`//${hostname}`} crossOrigin="true" />
          <link rel="dns-prefetch" href={`//${hostname}`} />
          <link
            href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;600;800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body spellCheck={false}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
