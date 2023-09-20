import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Suspense } from 'react'

import { Router } from 'routes/Router'
import { persistor, store } from 'store/store'

import ErrorBoundary from 'utils/ErrorBoundary/ErrorBoundary'

import { ToastContainer } from 'react-toastify'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import './styles/index.scss'

import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <BrowserRouter>
            <Suspense fallback={null}>
              <ErrorBoundary>
                <Router />
                <ToastContainer hideProgressBar={true} theme='dark' />
              </ErrorBoundary>
            </Suspense>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </LocalizationProvider>
  )
}

export default App
