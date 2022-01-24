import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    const uri = process.env.NEXT_PUBLIC_API_URI!;
    const { hostname } = new URL(uri);

    return (
      <Html lang="en" className="bg-gray-50">
        <Head>
          <link rel="preconnect" href={`//${hostname}`} crossOrigin="true" />
          <link rel="dns-prefetch" href={`//${hostname}`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
