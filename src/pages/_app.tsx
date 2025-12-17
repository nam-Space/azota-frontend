import RenderClientOnly from '@/components/RenderClientOnly'
import { store } from '@/redux/store'
import '@/styles/globals.css'
import 'react-quill/dist/quill.snow.css';
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'

import en from '../../i18n/en.json'
import vi from '../../i18n/vi.json'
import { IntlProvider } from 'react-intl';
import { useRouter } from 'next/router';
import { flatten } from 'flat'

const messages = {
  en, vi
}

function getDirection(locale: any) {
  return 'ltr'
}

export default function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter()

  return (
    <RenderClientOnly>
      <Provider store={store}>
        <IntlProvider locale={locale as any} messages={flatten((messages as any)[locale as any])}>
          <Component {...pageProps} dir={getDirection(locale)} />
        </IntlProvider>
      </Provider>
    </RenderClientOnly>)
}
