import { NextPage } from 'next'
import { ReactElement, ReactNode, useEffect } from 'react'
import { wrapper } from "../store/index";
import { Provider, useSelector } from "react-redux"
import { store, persistor, IRootState } from "../store/modules/index"
import { PersistGate } from 'redux-persist/integration/react'

import AppLayout from './components/layout/appLayout'
import HeaderLayout from './components/layout/headerLayout'

import type { AppProps } from 'next/app'
import Loading from './components/global/loading';
import '../public/font/font.css'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  typography: {
    fontFamily: "twayair"
  }
})

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const isLoading = useSelector<IRootState, boolean>(state => state.isLoading);
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <AppLayout>
            <HeaderLayout>{isLoading ? <Loading /> : null} <Component {...pageProps} /></HeaderLayout>
          </AppLayout>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default wrapper.withRedux(MyApp)