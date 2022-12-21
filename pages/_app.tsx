import '../styles/globals.css'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import AppLayout from './components/layout/appLayout'
import HeaderLayout from './components/layout/headerLayout'
import type { AppProps } from 'next/app'
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <AppLayout>
      <HeaderLayout><Component {...pageProps} /></HeaderLayout>

    </AppLayout>
  )
}