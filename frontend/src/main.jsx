import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './routes/App.jsx'
import './index.css'
import { store } from './app/store.js';


const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
     </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
)