"use client";
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
import { notFound } from "next/navigation";
import './globals.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { whiteLableBrandData } from '@/common/whitelable';
// export const metadata = {
//   title: 'Extraa Deals',
//   description: 'Extraa is India’s hyperlocal platform getting the best deals, tickets, coupons and offers on all your favourite brands in your city.',
// }

export const client = new ApolloClient({
  uri: "https://backend.extraa.in/v1/graphql",
  cache: new InMemoryCache(),
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{whiteLableBrandData?.name}</title>
        <meta name="verify-admitad" content="f3455f00ab" />
        <meta name="description" content="Extraa is India's hyperlocal platform getting the best deals, tickets, coupons and offers on all your favourite brands in your city." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Kalnia:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning={true} >
        <ApolloProvider client={client}>
          <Header />
          {children}
          <Footer />
        </ApolloProvider>
        <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js"></Script >
      </body>
      <GoogleAnalytics gaId="G-YBR02397NM" />
    </html>
  )
}
