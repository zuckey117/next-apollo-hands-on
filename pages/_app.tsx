import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../lib/apollo'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const client = getApolloClient()
  return (
    <>
      <Head>
        <title>Apollo Client Sample</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  )
}

export default MyApp
