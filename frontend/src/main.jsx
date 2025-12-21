import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import {ToastContainer} from 'react-toastify'
import {BrowserRouter} from 'react-router'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <div className='container'>
        <App />
        <ToastContainer autoClose={2000}/>
    </div>
  </BrowserRouter>,
)
